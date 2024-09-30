const purchaseOrderService = require("../../services/PurchaseOrderService");

async function Get(req, res, next) {
    try{
        purchaseOrderService.get(req, res, next)
    } catch(err){
        console.log(err);
    }
}

module.exports = Get;
