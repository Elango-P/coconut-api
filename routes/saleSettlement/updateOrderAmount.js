// Model
const { SaleSettlement } = require('../../db').models;

const ObjectName = require('../../helpers/ObjectName');
const Response = require('../../helpers/Response');
const ArrayList = require('../../lib/ArrayList');
// Lib
const saleSettlementService = require('../../services/SaleSettlementService');
const History = require('../../services/HistoryService');
const Request = require("../../lib/request");

async function updateOrderAmount(req, res, next) {
  let { id } = req.params;
  try {

    let saleSettlementId = ArrayList.StringIntoArray(id) ;

    if (saleSettlementId && saleSettlementId.length == 0) {
      return res.json(Response.BAD_REQUEST, { message: "Please select at least one item" });
    }
    const timeZone = Request.getTimeZone(req)

    await saleSettlementService.updateOrderAmount(req.user.company_id, saleSettlementId,timeZone);

    res.json(Response.OK, { message: " Sales Settlement Updated" });

  } catch (err) {
    console.log(err);
  }
}

module.exports = updateOrderAmount;
