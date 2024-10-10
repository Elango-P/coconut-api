
const purchaseOrderService = require("../../services/PurchaseOrderService");
const Permission = require("../../helpers/Permission");

async function list(req, res, next) {
    
try{

    purchaseOrderService.search(req, res, next)
} catch(err){
    console.log(err);
}
}

module.exports = list;
