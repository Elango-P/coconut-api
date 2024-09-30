const ObjectName = require("../../helpers/ObjectName");
const { BAD_REQUEST } = require("../../helpers/Response");
const  Salary  = require("../../helpers/Salary");
const Currency = require("../../lib/currency");
const DateTime = require("../../lib/dateTime");
const Number = require("../../lib/Number");
const Request = require("../../lib/request");
const History = require("../../services/HistoryService");
const { UserSalary:UserSalaryModal } = require("../../db").models;


async function create(req, res, next) {
    try {
        const data = req.body;
        const companyId = Request.GetCompanyId(req);
        

        let createData = {};

        createData.user_id = Number.Get(data.user);
        createData.start_date = data.start_date;
        createData.end_date = data.end_date;
        createData.house_rent_allowance = Number.Get(data.house_rent_allowance);
        createData.conveyance_allowance = Number.Get( data.conveyance_allowance);
        createData.medical_reimbursement = Number.Get(data.medical_reimbursement);
        createData.telephone_reimbursement = Number.Get(data.telephone_reimbursement);
        createData.leave_travel_allowance = Number.Get(data.leave_travel_allowance);
        createData.special_allowance = Number.Get(data.special_allowance);
        createData.medical_insurance_premium = Number.Get(data.medical_insurance_premium);
        createData.provident_fund_users = Number.Get(data.provident_fund_users);
        createData.provident_fund_user = Number.Get(data.provident_fund_user);
        createData.user_contribution = Number.Get(data.user_contribution);
        createData.gratuity = Number.Get(data.gratuity);
        createData.annual_bonus = Number.Get(data.annual_bonus);
        createData.ctc = Number.Get(data.ctc);
        createData.company_id = companyId;
        // createData.status = Salary.STATUS_DRAFT_VALUE;
        const UserSalary = await UserSalaryModal.create(createData);

        // systemLog
        res.json(200, {
            message: "UserSalary Created"
        });
        res.on("finish", async () => {
            //create system log for sale updation
            History.create("UserSalary Created", req, ObjectName.USER_SALARY, UserSalary.id);

        });

    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, {
            message: err.message
        });
    }
};

module.exports = create;