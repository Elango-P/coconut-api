const Response = require('../../helpers/Response');
const Request = require('../../lib/request');
const AccountProductService = require('../../services/AccountProductService');

async function addFromPurchase(req, res, next) {

  try {
    const params = req.body;

    const companyId = Request.GetCompanyId(req);

    await AccountProductService.addFromPurchase(params, companyId);

    res.json(Response.OK, { message: "Account Product Added" });
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, {
      message: err.message,
    });
  }
}
module.exports = addFromPurchase;
