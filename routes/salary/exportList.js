const { Salary,status ,User} = require("../../db").models;
const ObjectHelper = require("../../helpers/ObjectHelper");
const Month = require("../../lib/Month");
const Number = require("../../lib/Number");
const Request = require("../../lib/request");
const String = require("../../lib/string");

async function exportList(req, res, next) {
    const { selectedIds } = req.body; 

    try {
        const company_id = Request.GetCompanyId(req);

        if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
            return res.status(400).json({
                message: "Invalid or empty selectedIds"
            });
        }

        // Retrieve salaries for all selectedIds
        const salaryData = await Salary.findAll({
            where: {
                id: selectedIds,
                company_id: company_id,
            },
            include: [
                {
                  required: true,
                  model: User,
                  as: "user",
                  attributes: ["name", "last_name", "media_url"],
                },
                {
                  required: false,
                  model: status,
                  as: "statusDetail",
                  attributes: ["name", "id", "color_code"],
                },
              ],
        });

        if (salaryData.length === 0) {
            return res.status(200).json({
                message: "No Records Found"
            });
        }
        const totalAmountQuery = {
            attributes: { exclude: ["deletedAt"] },
            where: {
                id: selectedIds,
                company_id: company_id,
            },
           
          };
          const totalSalarydetails = await Salary.findAll(totalAmountQuery);
      
          const columnSums = {
            additional_day_allowance: 0,
            other_deductions: 0,
            net_salary: 0,
            monthly_salary: 0,
            leave_salary: 0,
            fine: 0,
            bonus: 0,
            additional_hour_amount: 0,
            worked_days_salary: 0,
            other_allowance: 0,
          };
          totalSalarydetails.forEach((value) => {
            columnSums.additional_day_allowance += Number.Get(value.get("additional_day_allowance"));
            columnSums.other_deductions += Number.Get(value.get("other_deductions"));
            columnSums.net_salary += Number.Get(value.get("net_salary"));
            columnSums.leave_salary += Number.Get(value.get("leave_salary"));
            columnSums.fine += Number.Get(value.get("fine"));
            columnSums.bonus += Number.Get(value.get("bonus"));
            columnSums.additional_hour_amount += Number.Get(value.get("additional_hour_amount"));
            columnSums.worked_days_salary += Number.Get(value.get("worked_days_salary"));
            columnSums.other_allowance += Number.Get(value.get("other_allowance"));
          });
        // Transform the results into a suitable format
        const data = salaryData.map(salary => {
            let {
                user,
                working_days,
                worked_days,
                additional_days,
                basic,
                gratuity,
                hra,
                leave,
                medical_insurance,
                net_salary,
                professional_tax,
                standard_allowance,
                unPaid_leaves,
                special_allowance,
                salary_number,
                monthly_salary,
                salary_per_day,
                bonus,
                tds,
                provident_fund,
                other_deductions,
                leave_salary,
                additional_day_allowance,
                absent,
                status,
                fine,
                worked_days_salary,
                other_allowance,
                statusDetail,
                month,
                year,
                additional_hours,
                additional_hour_amount
            } = salary.get();

            return {
                user: String.concatName(user?.name, user?.last_name),
                month:Month.get(month),
                year:year,
                monthly_salary,
                working_days,
                worked_days,
                basic,
                hra,
                standard_allowance,
                special_allowance,
                medical_insurance,
                gratuity,
                additional_days,
                additional_day_allowance,
                additional_hours,
                additional_hour_amount,
                leave,
                leave_salary,
                other_deductions,
                fine,
                professional_tax,
                net_salary,
                unPaid_leaves,
                salary_number,
                salary_per_day,
                bonus,
                tds,
                provident_fund,
                absent,
                worked_days_salary,
                other_allowance,               
                status:statusDetail?.name,
        
            };
        });
        let lastReCord = ObjectHelper.createEmptyRecord(data[0]) 
  lastReCord.net_salary = columnSums.net_salary
  lastReCord.additional_day_allowance = columnSums.additional_day_allowance
  lastReCord.other_deductions = columnSums.other_deductions
  lastReCord.monthly_salary = columnSums.monthly_salary
  lastReCord.leave_salary = columnSums.leave_salary
  lastReCord.fine = columnSums.fine
  lastReCord.additional_hour_amount = columnSums.additional_hour_amount,
  lastReCord.worked_days_salary = columnSums.worked_days_salary,
  lastReCord.other_allowance = columnSums.other_allowance
  data.push(lastReCord)

        res.json(200, data);
    } catch (err) {
        next(err);
        console.log(err);
    }
}

module.exports = exportList;
