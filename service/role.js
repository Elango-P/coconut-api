const { Op } = require("sequelize");
const errors = require("restify-errors");
function roleService(db) {
  const { Role, RolePermission } = db.models;
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
      return cb(new errors.BadRequestError("Role Id is Required"));
    }

    Role.findOne({
      attributes: ["id", "name"],
      where: { id: this.id },
    }).then((role) => {
      if (!role) {
        return cb(new errors.BadRequestError("Role not found"));
      }

      return cb(null, role);
    });
  };

  this.validateRole = (cb) => {
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

    this.validateRole((err) => {
      if (err) {
        return cb(err);
      }

      Role.count({ where }).then((count) => {
        if (count > 0) {
          return cb(new errors.BadRequestError("Role already exist"));
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

    return Role.update(data, { where: { id: this.id } })
      .then(() => cb())
      .catch((err) => cb(err));
  };

  this.create = (cb) => {
    const data = this.getData();
    if (Object.keys(data).length === 0) {
      return cb();
    }

    return Role.create(data)
      .then((role) => cb(null, role))
      .catch((err) => cb(err));
  };

  this.del = (cb) => {
    this.get((err, role) => {
      if (err) {
        return cb(err);
      }

      return Promise.all([
        RolePermission.destroy({ where: { role_id: this.id } }),
        role.destroy(),
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
    Role.findAll({
      attributes: ["id", "name"],
    }).then((roles) => cb(null, roles));
  };
}

module.exports = roleService;
