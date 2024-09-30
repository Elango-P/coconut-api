
const purchaseOrderService = require("../../services/PurchaseOrderService");
const Permission = require("../../helpers/Permission");

async function list(req, res, next) {
    
try{
    const hasPermission = await Permission.Has(Permission.PURCHASE_ORDER_VIEW, req);
    if (!hasPermission) {
      return res.json(400, { message: "Permission Denied" });
    }
    purchaseOrderService.search(req, res, next)
} catch(err){
    console.log(err);
}
}

module.exports = list;
