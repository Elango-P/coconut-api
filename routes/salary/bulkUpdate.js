const Request = require('../../lib/request');
const Response = require('../../helpers/Response');
const SalaryService = require('../../services/SalaryService');

async function bulkUpdate(req, res) {
  try {
    const companyId = Request.GetCompanyId(req);

    let params = {
      data: req.body,
      companyId: companyId,
      timeZone: Request.getTimeZone(req)
    };

  let response =  await SalaryService.bulkUpdate(params)

    if (response) {
      res.json(200, {
        message: 'Salary Data Updated',
      });
    }
  } catch (err) {
    console.log(err);
    return res.json(Response.BAD_REQUEST, { message: err.message });
  }
}
module.exports = bulkUpdate;
