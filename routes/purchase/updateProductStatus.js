
const PurchaseService = require("../../services/services/purchaseService");

const Permission = require("../../helpers/Permission");

async function updateProductStatus(req, res, next) {

  PurchaseService.updateProductStatus(req,res, next);
}

module.exports = updateProductStatus;
