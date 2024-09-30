const Response = require("../../helpers/Response");
const Request = require("../../lib/request");
const AttendanceTypeService = require("../../services/AttendanceTypeService");

const list = async (req, res, next) => {
  try {
    let companyId = Request.GetCompanyId(req);
    if (!companyId) {
      return res.json(Response.BAD_REQUEST, "Company Not Found");
    }
    let params = {
      company_id: companyId,
      ...req.query,
    };

    let response = await AttendanceTypeService.list(params);
    if (response) {
      res.json(Response.OK, { ...response });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = list;
