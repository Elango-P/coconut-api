const errors = require("restify-errors");

// Get Config
const getConfig = require("./getConfig");

// Validator
const validator = require("../../lib/validator");

function list(req, res, next) {
  const { id } = req.params;

  if (!validator.isInteger(id)) {
    return next(new errors.BadRequestError("Invalid user"));
  }

  getConfig(id, (err, userConfigs) => {
    res.json(userConfigs);
  });
}

module.exports = list;
