const purchaseOrderService = require("../../services/PurchaseOrderService");

async function Clone(req, res, next) {
    try{
        purchaseOrderService.clone(req, res, next)
    } catch(err){
        console.log(err);
    }
}

module.exports = Clone;