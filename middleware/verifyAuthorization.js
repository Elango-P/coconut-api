const restify = require("restify");
const config = require("../lib/config");
const errors = require("restify-errors");

module.exports = (req, res, next) => {
  const token = req.header("authorization");

  if (!token) {
    return next(new errors.UnauthorizedError("Missing authorization header"));
  }

  if (token) {
    if (token !== config.defaultApiKey) {
      return next(new errors.UnauthorizedError("Invalid Token"));
    }
    return next();
  }
};
