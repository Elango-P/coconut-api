//Lib
const { BAD_REQUEST } = require("../../helpers/Response");
const saleSettlementService = require("../../services/SaleSettlementService");

// Model
const { SaleSettlement, Location } = require("../../db").models;

async function create(req, res, next) {
  saleSettlementService.create(req, res, next)

}

module.exports = create;
