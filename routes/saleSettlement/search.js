const { SaleSettlement, Location, User } = require("../../db").models;

const { Op, Sequelize, fn, col } = require("sequelize");
const saleSettlementService = require("../../services/SaleSettlementService");

//Lib
const Request = require("../../lib/request");
const Date = require("../../lib/dateTime");
const Permission = require("../../helpers/Permission");

async function List(req, res, next) {
  saleSettlementService.search(req, res, next)
}

module.exports = List;
