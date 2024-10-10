const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const Request = require("../../lib/request");
const transferService = require("../../services/TransferService");

async function create(req, res, next) {
  const companyId = Request.GetCompanyId(req);

  if (!companyId) {
    return res.json(Response.BAD_REQUEST, { message: "Company Not Found" });
  }


  try {
    transferService.create(req, res, next)
  } catch (err) {
    console.log(err);
  }
};

module.exports = create;