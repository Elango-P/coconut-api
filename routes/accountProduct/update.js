const ObjectName = require("../../helpers/ObjectName");
const Response = require('../../helpers/Response');
const Request = require('../../lib/request');
const AccountProductService = require('../../services/AccountProductService');
const History = require("../../services/HistoryService");

async function update(req, res, next) {
  try {
    const params = req.params;

    const companyId = Request.GetCompanyId(req);

    await AccountProductService.update(params, companyId);

    res.json(200,{message:"Account Product Updated"});

    History.create(`Account Product Updated`, req, ObjectName.ACCOUNT_PRODUCT, params.id);
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, {
      message: err.message,
    });
  }
}
module.exports = update;
