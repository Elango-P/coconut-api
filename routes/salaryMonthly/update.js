const errors = require("restify-errors");

//  Validate
const validate = require("./validate");

// Models
const { SalaryMonthly } = require("../../db").models;

function update(req, res, next) {


  const data = req.body;

  const salaryId = req.params.salaryId;
  data.salaryId = salaryId;

  validate(data, (err) => {
    if (err) {
      return next(err);
    }

    SalaryMonthly.findOne({
      attributes: ["id"],
      where: { id: salaryId },
    }).then((salaryMonthly) => {
      if (!salaryMonthly) {
        return next(new errors.NotFoundError("Salary not found"));
      }

      salaryMonthly
        .update({
          user_id: data.userId,
          month: data.month,
          year: data.year,
          basic_salary: data.basicSalary,
          house_rent_allowance: data.houseRentAllowance,
          conveyance: data.conveyance,
          medical_allowance: data.medicalAllowance,
          telephone_allowance: data.telephoneAllowance,
          leave_travel_allowance: data.leaveTravelAllowance,
          special_allowance: data.specialAllowance,
          night_shift_allowance: data.nightShiftAllowance,
          medical_insurance: data.medicalInsurance,
          provident_fund: data.providentFund,
          user_state_insurance: data.userStateInsurance,
          gratuity: data.gratuity,
          cost_to_company: data.costToCompany,
          additional_days: data.additionalDays,
          additional_days_allowance: data.additionalDaysAllowance,
          additional_bonus: data.additionalBonus,
          absent_days: data.absentDays,
          lop_for_absent: data.lopForAbsent,
          late_hours_days: data.lateHoursDays,
          late_hours_deduction: data.lateHoursDeduction,
          loan_deduction: data.loanDeduction,
          gross_salary: data.grossSalary,
          professional_tax: data.professionalTax,
          tds: data.tds,
          net_salary: data.netSalary,
          notes: data.notes,
          status: data.status,
        })
        .then((salaryMonthlyDetails) => {
          res.json({
            message: "Salary updated",
            salaryId: salaryMonthlyDetails.get("id"),
          });
        })
        .catch((err) => {
          console.log(err);
          req.log.error(err);
          return next(err);
        });
    });
  });
}

module.exports = update;
