const { Op } = require("sequelize");

// Models
const { SaleSettlement, order, orderProduct, productIndex } = require("../../db").models;

// Util
const Request = require("../../lib/request");
const { BAD_REQUEST } = require("../../helpers/Response");
const { sequelize } = require("../../db");
const saleProductService = require("../../services/SaleProductService");

const search = async (req, res) => {
  saleProductService.search(req, res)
};

module.exports = search;
