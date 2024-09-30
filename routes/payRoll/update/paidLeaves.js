const errors = require("restify-errors");

const { Payroll } = require("../../../db").models;

function paidLeaves(req, res, next) {
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
          paid_leaves: data.paidLeaves,
        })
        .then(() => {
          res.json({
            message: "Paid Leaves updated",
          });
        });
    })
    .catch((err) => {
      req.log.error(err);
      next(err);
    });
}

module.exports = paidLeaves;
