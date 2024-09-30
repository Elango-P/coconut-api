const errors = require("restify-errors");

const { Payroll } = require("../../../db").models;

function panNumber(req, res, next) {
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
          pan_number: data.panNumber,
        })
        .then(() => {
          res.json({
            message: "PanNumber updated",
          });
        });
    })
    .catch((err) => {
      req.log.error(err);
      next(err);
    });
}

module.exports = panNumber;
