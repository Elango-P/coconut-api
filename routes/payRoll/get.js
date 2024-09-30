const errors = require("restify-errors");
const validator = require("../../lib/validator");
const processPayroll = require("./processPayroll");

const { Payroll, User } = require("../../db").models;

function get(req, res, next) {
  const payrollId = req.params.id;

  if (!validator.isInteger(payrollId)) {
    return next(new errors.BadRequestError("Invalid Payroll"));
  }

  const query = {
    include: [
      {
        required: true,
        model: User,
        as: "user",
        attributes: ["name"],
      },
    ],
    where: { id: payrollId },
  };

  Payroll.findOne(query).then((payrollList) =>
    res.json(processPayroll(payrollList))
  );
}

module.exports = get;
