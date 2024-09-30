function rolePermissionService(db) {
  const { sequelize, models } = db;
  const { Role, Permission, RolePermission } = models;
  const errors = require("restify-errors");

  this.permissions = [];
  this.role;

  this.getPermissions = () => this.permissions;

  this.setPermissions = (permissions) => {
    this.permissions = permissions;
  };

  this.getRole = () => this.role;

  this.setRole = (role) => {
    this.role = role;
  };

  this.validate = (cb) => {
    if (!this.role) {
      return cb(new errors.BadRequestError("Role is Required"));
    }

    Role.count({
      where: { id: this.role },
    }).then((isExist) => {
      if (!isExist) {
        return cb(new errors.BadRequestError("Role not found"));
      }

      if (this.permissions.length === 0) {
        return cb();
      }

      const permissions = [];
      this.permissions.forEach((permission) => {
        if (permissions.indexOf(permission) < 0) {
          permissions.push(permission);
        }
      });

      Permission.count({
        where: {
          id: { $in: permissions },
        },
      }).then((permissionsCount) => {
        if (permissionsCount !== permissions.length) {
          return cb(new errors.BadRequestError("Permission not found"));
        }

        return cb();
      });
    });
  };

  this.save = (cb) => {
    this.validate((err) => {
      if (err) {
        return cb(err);
      }

      const rolePermissionWhere = { role_id: this.role };
      if (this.permissions.length > 0) {
        rolePermissionWhere.permission_id = { $notIn: this.permissions };
      }

      Promise.all([
        RolePermission.findAll({
          attributes: ["permission_id"],
          where: {
            role_id: this.role,
          },
        }),
        RolePermission.destroy({
          where: rolePermissionWhere,
        }),
      ]).then(([rolePermissions]) => {
        const existPermissions = [];
        rolePermissions.forEach((rolePermission) => {
          existPermissions.push(rolePermission.permission_id);
        });

        const permissions = [];
        this.permissions.forEach((permission) => {
          if (existPermissions.indexOf(permission) < 0) {
            permissions.push(permission);
          }
        });

        if (permissions.length === 0) {
          return cb();
        }

        const data = [];
        permissions.forEach((permission) => {
          data.push({
            role_id: this.role,
            permission_id: permission,
          });
        });

        return RolePermission.bulkCreate(data)
          .then(() => cb())
          .catch((err) => cb(err));
      });
    });
  };

  this.list = (cb) => {
    RolePermission.findAll({
      attributes: [
        "role_id",
        [
          sequelize.fn("group_concat", sequelize.col("permission_id")),
          "permission_ids",
        ],
      ],
      group: "role_id",
      include: [
        {
          required: true,
          model: Role,
          as: "role",
          attributes: ["name"],
        },
      ],
    }).then((rolePermissions) => {
      const rolePermissionsList = [];
      rolePermissions.forEach((rolePermission) => {
        rolePermission = rolePermission.get();
        rolePermissionsList.push({
          role_id: rolePermission.role_id,
          role_name: rolePermission.role.name,
          permission_ids: rolePermission.permission_ids
            ? rolePermission.permission_ids.split(",")
            : "",
        });
      });
      return cb(null, rolePermissionsList);
    });
  };
}

module.exports = rolePermissionService;
