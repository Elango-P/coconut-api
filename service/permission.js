const { Op } = require("sequelize");
const errors = require("restify-errors");


function permissionService(db) {
  const { Permission, RolePermission } = db.models;
  const restify = require("restify");

  this.id;
  this.name;

  this.getId = () => this.id;

  this.setId = (id) => {
    this.id = id;
  };

  this.getName = () => this.name;

  this.setName = (name) => {
    this.name = name;
  };

  this.getData = () => {
    const data = {};
    if (typeof this.name !== "undefined") {
      data.name = this.name;
    }

    return data;
  };

  this.get = (cb) => {
    if (!this.id) {
      return cb(new errors.BadRequestError("Permission Id is Required"));
    }

    Permission.findOne({
      attributes: ["id", "name"],
      where: { id: this.id },
    }).then((permission) => {
      if (!permission) {
        return cb(new errors.BadRequestError("Permission not found"));
      }

      return cb(null, permission);
    });
  };

  this.validatePermission = (cb) => {
    if (!this.id) {
      return cb();
    }

    return this.get(cb);
  };

  this.validate = (cb) => {
    if (!this.name) {
      return cb(new errors.BadRequestError("Name is Required"));
    }

    const where = { name: this.name };
    if (this.id) {
      where.id = { [Op.ne]: this.id };
    }

    this.validatePermission((err) => {
      if (err) {
        return cb(err);
      }

      Permission.count({ where }).then((count) => {
        if (count > 0) {
          return cb(new errors.BadRequestError("Permission already exist"));
        }

        return cb();
      });
    });
  };

  this.update = (cb) => {
    const data = this.getData();
    if (Object.keys(data).length === 0) {
      return cb();
    }

    return Permission.update(data, { where: { id: this.id } })
      .then(() => cb())
      .catch((err) => cb(err));
  };

  this.create = (cb) => {
    const data = this.getData();
    if (Object.keys(data).length === 0) {
      return cb();
    }

    return Permission.create(data)
      .then((permission) => cb(null, permission))
      .catch((err) => cb(err));
  };

  this.del = (cb) => {
    this.get((err, permission) => {
      if (err) {
        return cb(err);
      }

      return Promise.all([
        RolePermission.destroy({ where: { permission_id: this.id } }),
        permission.destroy(),
      ])
        .then(() => cb())
        .catch((err) => cb(err));
    });
  };

  this.save = (cb) => {
    this.validate((err) => {
      if (err) {
        return cb(err);
      }

      if (this.id) {
        return this.update(cb);
      }

      return this.create(cb);
    });
  };

  this.list = (cb) => {
    Permission.findAll({
      attributes: ["id", "name"],
    }).then((permissions) => cb(null, permissions));
  };
}

module.exports = permissionService;
