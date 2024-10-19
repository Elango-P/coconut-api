const errors = require("restify-errors");
const async = require("async");

// Models
const { UserConfig } = require("../../db").models;

//  Validator
const validator = require("../../lib/validator");

// Save Config
function saveConfig(user_id, name, value, callback) {
  value = typeof value === "object" ? value.join(",") : value;

  UserConfig.findOne({
    attributes: ["id"],
    where: { user_id, name },
  }).then((config) => {
    if (config) {
      return config
        .update({ value })
        .then(() => callback())
        .catch((err) => callback(err));
    }

    return UserConfig.create({ user_id, name, value })
      .then(() => callback())
      .catch((err) => callback(err));
  });
}

function save(req, res, next) {
  if (!req.isAdmin && !req.isManager) {
    return next(new errors.UnauthorizedError("Permission Denied"));
  }

  const { id } = req.params;
  if (!validator.isInteger(id)) {
    return next(new errors.BadRequestError("Invalid user"));
  }

  const data = req.body;
  async.eachSeries(
    Object.keys(data),
    (configKey, cb) => saveConfig(id, configKey, data[configKey], cb),
    (err) => {
      if (err) {
        return next(err);
      }

      res.json(201, { message: "User Config saved" });
    }
  );
}

module.exports = save;
