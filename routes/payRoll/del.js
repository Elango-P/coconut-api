const errors = require("restify-errors");
const validator = require("../../lib/validator");

const { Payroll } = require("../../db").models;

function del(req, res, next) {
  const payRollId = req.params.id;

  if (!req.isAdmin) {
    return next(new errors.UnauthorizedError("Permission Denied"));
  }

  if (!validator.isInteger(payRollId)) {
    return next(new errors.BadRequestError("Invalid Payroll Page"));
  }

  Payroll.findOne({
    where: { id: payRollId },
  }).then((payroll) => {
    if (!payroll) {
      return next(new errors.NotFoundError("Payroll not found"));
    }
    payroll
      .destroy()
      .then(() => {
        res.json({ message: "Payroll deleted" });
      })
      .catch((err) => {
        req.log.error(err);
        return next(err);
      });
  });
}

module.exports = del;
