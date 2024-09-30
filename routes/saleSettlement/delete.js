const restify = require("restify");
const errors = require("restify-errors");
const validator = require("../../lib/validator");
const s3 = require("../../lib/s3");
const { SaleSettlement }  = require("../../db").models;
const Request = require("../../lib/request");
const Permission = require("../../helpers/Permission");
// const Sales = require("../../db/models/Sales");
const ObjectName = require("../../helpers/ObjectName");
const History = require("../../services/HistoryService");
const saleSettlementService = require("../../services/SaleSettlementService");
 
async function del(req, res, next) {
saleSettlementService.del(req, res, next)
  }
  
  module.exports = del;
  