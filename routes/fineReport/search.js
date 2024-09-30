const Response = require('../../helpers/Response');
const Request = require("../../lib/request");
const FineBonusReportService = require('../../services/FineBonusReportService');

async function search(req, res, next) {
  try {
    let companyId = Request.GetCompanyId(req);
    let params = req.query;

    let data = await FineBonusReportService.search(params, companyId, req);

    res.json(data);
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, { message: err.message });
  }
}
module.exports = search;
