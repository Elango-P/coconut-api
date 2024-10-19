const errors = require("restify-errors");
const dashoboardIndexService = require("../../services/dashboardIndex");

function reIndexAll(req, res, next) {
  if (!req.isAdmin && !req.isManager) {
    return next(new errors.UnauthorizedError("Permission Denied"));
  }

  res.json({ message: "Ticket Dashboard reIndexed" });

  res.on("finish", () => dashoboardIndexService.reIndexAll());
}

module.exports = reIndexAll;
