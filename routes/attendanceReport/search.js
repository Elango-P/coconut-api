// Status
const Response = require('../../helpers/Response');
const Request = require("../../lib/request");
const attendanceReportService = require('../../services/attendanceReportService');

async function search(req, res, next) {
  try {
    let companyId = Request.GetCompanyId(req);

    if (!companyId) {
      return res.json(Response.BAD_REQUEST, { message: "Company Not Found" });
    }
    let params = req.query

    let data = await attendanceReportService.search(params, companyId);
    if (data) {
      return res.json(data);
    }
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, { message: err.message });
  }
}
module.exports = search;
