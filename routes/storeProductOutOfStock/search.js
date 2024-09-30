
const storeProductOutOfStockService = require("../../services/storeProductOutOfStockService");


const search = async (req, res) => {
  storeProductOutOfStockService.search(req, res);
};

module.exports = search;