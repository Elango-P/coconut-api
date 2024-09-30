
const saleSettlementService = require("../../services/SaleSettlementService");

async function Get(req, res, next) {
 
  saleSettlementService.get(req, res, next)
}

module.exports = Get;
