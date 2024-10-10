const Permission = require("../../helpers/Permission");

const PurchaseService = require("../../services/services/purchaseService");

async function del(req, res, next) {

  PurchaseService.delete(req, res, next);
}

module.exports = del;
