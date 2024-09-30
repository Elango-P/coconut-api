const Response = require("../../helpers/Response");
const Request = require("../../lib/request");
const AccountTypeService = require("../../services/AccountTypeService");

async function Get(req, res, next) {
  try {
    const companyId = Request.GetCompanyId(req);

    //validate Order Id exist or not
    if (!companyId) {
      return res.json(Response.BAD_REQUEST, { message: "Company Not Exists" });
    }
    let data = await AccountTypeService.list(req.query, companyId);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.send(Response.BAD_REQUEST, { message: err.message });
  }
}

module.exports = Get;
