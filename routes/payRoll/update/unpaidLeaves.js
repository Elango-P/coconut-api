const errors = require("restify-errors");

const { Payroll } = require("../../../db").models;

function unpaidLeaves(req, res, next) {
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
          unpaid_leaves: data.unpaidLeaves,
        })
        .then(() => {
          res.json({
            message: "UnPaid Leaves updated",
          });
        });
    })
    .catch((err) => {
      req.log.error(err);
      next(err);
    });
}

module.exports = unpaidLeaves;
