const PurchaseService = require("../../services/services/purchaseService");

const Permission = require("../../helpers/Permission");

async function update(req, res, next) {
  


  PurchaseService.update(req, res, next);
}

module.exports = update;
