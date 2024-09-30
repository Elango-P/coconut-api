const Request = require("../../lib/request");

// Models
const { SaleProduct, product, storeProduct } = require("../../db").models;
const saleProductService = require("../../services/SaleProductService");


const create = async (req, res) => {
  saleProductService.create(req, res);
};

module.exports = create;
