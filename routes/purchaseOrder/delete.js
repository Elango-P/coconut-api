const purchaseOrderService = require("../../services/PurchaseOrderService");
const Permission = require("../../helpers/Permission");

 
async function del(req, res, next) {

    purchaseOrderService.del(req, res, next)
  }
  
  module.exports = del;
  