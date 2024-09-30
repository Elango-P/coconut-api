
const storeProductOutOfStockService = require("../../services/storeProductOutOfStockService");


/**
 * Product create route
 */
async function create(req, res, next) {
  storeProductOutOfStockService.create(req, res);
}

module.exports = create;
