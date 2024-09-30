const restify = require("restify");
const errors = require("restify-errors");

module.exports = (req, res, next) => {
  if (!req.isAdmin && !req.isManager) {
    return next(new errors.UnauthorizedError("Permission Denied"));
  }

  return next();
};
