const Response = require("../../helpers/Response");
const Request = require("../../lib/request");
const SalaryService = require("../../services/SalaryService");

const projectionReport = async (req, res, next) => {
  try {
    const companyId = Request.GetCompanyId(req);

    if (!companyId) {
      return res.json(Response.BAD_REQUEST, {
        message: "Company id is required",
      });
    }


    let params = {
      ...req.query,
      companyId: companyId,
      timeZone: Request.getTimeZone(req)
    };

    let response = await SalaryService.projectionReport(params);
    return res.json(Response.OK, {
      data: response?.paginatedResults,
      totalCount:response?.totalCount,
      pageSize:response?.pageSize,
      currentPage:response?.page
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = projectionReport;
