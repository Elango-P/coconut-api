const errors = require("restify-errors");

const { Payroll } = require("../../../db").models;

function workingDays(req, res, next) {
  const data = req.body;

  const payRollId = req.params.id;

  if (!payRollId) {
    return next(new errors.BadRequestError("PayrollId is required"));
  }

  Payroll.findById(payRollId)
    .then((payroll) => {
      if (!payroll) {
        return next(new errors.NotFoundError("Payroll not found"));
      }
      payroll
        .update({
          working_days: data.workingDays,
        })
        .then(() => {
          res.json({
            message: "Working Days updated",
          });
        });
    })
    .catch((err) => {
      req.log.error(err);
      next(err);
    });
}

module.exports = workingDays;
