// Model
const { SaleSettlement } = require("../../db").models;

const Permission = require("../../helpers/Permission");
// Lib
const saleSettlementService = require("../../services/SaleSettlementService");

const Request = require("../../lib/request");
const History = require("../../services/HistoryService");
const Object = require("../../helpers/ObjectName");
async function updateByStatus(req, res, next) {
  saleSettlementService.updateByStatus(req, res, next)
}

module.exports = updateByStatus;
