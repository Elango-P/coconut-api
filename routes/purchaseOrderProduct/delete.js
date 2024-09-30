const purchaseOrderProductService = require("../../services/PurchaseOrderProductService");

 
async function del(req, res, next) {
    purchaseOrderProductService.del(req, res, next)
  }
  
  module.exports = del;
  