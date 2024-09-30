const Response = require('../../helpers/Response');
const Request = require('../../lib/request');
const AccountProductService = require('../../services/AccountProductService');

async function search(req, res, next) {
  try {
    const params = req.query;

    const companyId = Request.GetCompanyId(req);

    let data = await AccountProductService.search(params, companyId);

    res.json(data);
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, {
      message: err.message,
    });
  }
}
module.exports = search;
