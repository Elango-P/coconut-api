const purchaseOrderService = require("../../services/PurchaseOrderService");


async function productList(req, res, next) {
    try{
        purchaseOrderService.productList(req, res, next)
    } catch(err){
        console.log(err);
    }
}
module.exports = productList;
