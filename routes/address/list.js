const Response = require("../../helpers/Response");
const Request = require("../../lib/request");
const AddressService = require("../../services/AddressService");

async function list(req, res, next) {
  try {
    const companyId = Request.GetCompanyId(req);

    let params = {
      companyId: companyId,
    };
    let response = AddressService.list(params);
    // Return Address is null
    if (response.length === 0) {
      return res.json([]);
    } else {
      res.json(Response.OK, {
        response,
      });
    }
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, { message: err.message });
  }
}

module.exports = list;