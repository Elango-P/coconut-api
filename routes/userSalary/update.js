const ObjectName = require('../../helpers/ObjectName');
const { BAD_REQUEST } = require('../../helpers/Response');
const Currency = require('../../lib/currency');
const DateTime = require('../../lib/dateTime');
const Number = require('../../lib/Number');
const Request = require('../../lib/request');
const { UserSalary } = require('../../db').models;
const History = require('../../services/HistoryService');

const update = async (req, res, next) => {
  let data = req.body;
  let { id } = req.params;
  try {
    let companyId = Request.GetCompanyId(req);

    if (!id) {
      return res.json(400, {
        message: 'Invalid Id',
      });
    }

    let salaryId = await UserSalary.findOne({
      attributes: ['id'],
      where: {
        id: id,
        company_id: companyId,
      },
    });

    if (!salaryId) {
      return res.json(BAD_REQUEST, {
        message: 'UserSalary Detail Not Found',
      });
    }

    let updateData = {};
    
    updateData.user_id = data.user ? data.user : '';
    updateData.start_date = data.start_date ? data.start_date : '';
    updateData.end_date = data.end_date ? data.end_date : '';
    updateData.house_rent_allowance = Number.Get(data.house_rent_allowance);
    updateData.conveyance_allowance = Number.Get(data.conveyance_allowance);
    updateData.medical_reimbursement = Number.Get(data.medical_reimbursement);
    updateData.telephone_reimbursement = Number.Get(data.telephone_reimbursement);
    updateData.leave_travel_allowance = Number.Get(data.leave_travel_allowance);
    updateData.special_allowance = Number.Get(data.special_allowance);
    updateData.medical_insurance_premium = Number.Get(data.medical_insurance_premium);
    updateData.provident_fund_users = Number.Get(data.provident_fund_users);
    updateData.provident_fund_user = Number.Get(data.provident_fund_user);
    updateData.user_contribution = Number.Get(data.user_contribution);
    updateData.gratuity = Number.Get(data.gratuity);
    updateData.annual_bonus = Number.Get(data.annual_bonus);
    updateData.ctc = Number.Get(data.ctc);

    await UserSalary.update(updateData, {
      where: {
        id: id,
        company_id: companyId,
      },
    });
    
    res.json(200, {
      message: 'UserSalary Data Updated',
    });
    res.on('finish', async () => {
      History.create('UserSalary Updated', req, ObjectName.USER_SALARY, id);
    });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, {
      message: err.message,
    });
  }
};

module.exports = update;
