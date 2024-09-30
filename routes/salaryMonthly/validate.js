const errors = require("restify-errors");
const { Op } = require("sequelize");

// Validator
const validator = require("../../lib/validator");

// Models
const { SalaryMonthly } = require("../../db").models;

function validate(data, callback) {
  const validations = [
    {
      value: data.salaryId,
      label: "salary id",
      type: "integer",
      optional: true,
    },
    { value: data.userId, label: "user id", type: "integer" },
    { value: data.month, label: "month", type: "integer" },
    { value: data.year, label: "year", type: "integer" },
    {
      value: data.workingDays,
      label: "working days",
      type: "integer",
      optional: true,
    },
    {
      value: data.workedDays,
      label: "worked days",
      type: "integer",
      optional: true,
    },
    {
      value: data.additionalDays,
      label: "additional days",
      type: "integer",
      optional: true,
    },
    {
      value: data.paidLeaves,
      label: "paid leaves",
      type: "integer",
      optional: true,
    },
    {
      value: data.unpaidLeaves,
      label: "unpaid leaves",
      type: "integer",
      optional: true,
    },
    {
      value: data.estimatedPoints,
      label: "estimated Hours",
      type: "integer",
      optional: true,
    },
    {
      value: data.basicSalary,
      label: "basic salary",
      type: "integer",
      optional: true,
    },
    {
      value: data.nightShiftAllowance,
      label: "night shift allowance",
      type: "integer",
      optional: true,
    },
    {
      value: data.lunchAllowance,
      label: "lunch allowance",
      type: "integer",
      optional: true,
    },
    {
      value: data.travelAllowance,
      label: "travel allowance",
      type: "integer",
      optional: true,
    },
    {
      value: data.houseRentAllowance,
      label: "house rent allowance",
      type: "integer",
      optional: true,
    },
    {
      value: data.additionalDaysBonus,
      label: "additional days bonus",
      type: "integer",
      optional: true,
    },
    {
      value: data.dinnerAllowance,
      label: "dinner allowance",
      type: "integer",
      optional: true,
    },
    {
      value: data.specialAllowance,
      label: "special allowance",
      type: "integer",
      optional: true,
    },
    {
      value: data.reimbursement,
      label: "reimbursement",
      type: "integer",
      optional: true,
    },
    {
      value: data.storyPointsBonus,
      label: "story points bonus",
      type: "integer",
      optional: true,
    },
    {
      value: data.lossOfPayAmount,
      label: "loss of pay amount",
      type: "integer",
      optional: true,
    },
    {
      value: data.loanDeduction,
      label: "loan deduction",
      type: "integer",
      optional: true,
    },
    {
      value: data.netSalary,
      label: "net salary",
      type: "integer",
      optional: true,
    },
    {
      value: data.grossSalary,
      label: "gross salary",
      type: "integer",
      optional: true,
    },
  ];

  validator.validateFields(validations, (err) => {
    if (err) {
      return callback(err);
    }

    const user_id = data.userId;
    const month = data.month;
    const year = data.year;
    const salaryId = data.salaryId;

    const where = { user_id, month, year };
    if (salaryId) {
      where.id = { [Op.ne]: salaryId };
    }

    SalaryMonthly.count({ where }).then((salary) => {
      if (salary) {
        return callback(new errors.BadRequestError("Salary already exist"));
      }

      return callback();
    });
  });
}

module.exports = validate;
