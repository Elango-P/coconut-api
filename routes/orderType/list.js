const Response = require("../../helpers/Response");
const Request = require("../../lib/request");
const OrderTypeService = require("../../services/OrderTypeService");

async function Get(req, res, next) {
  try {
    const companyId = Request.GetCompanyId(req);

    //validate Order Id exist or not
    if (!companyId) {
      return res.json(Response.BAD_REQUEST, { message: "Company Not Exists" });
    }
    let data = await OrderTypeService.list(companyId);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.send(Response.BAD_REQUEST, { message: err.message });
  }
}

module.exports = Get;
