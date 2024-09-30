const transferService = require("../../services/TransferService");

async function replenishProduct(req, res, next) {
  try {
    transferService.replenishProduct(req, res, next);
  } catch (err) {
    console.log(err);
  }
}

module.exports = replenishProduct;
