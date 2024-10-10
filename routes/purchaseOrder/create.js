const Permission = require("../../helpers/Permission");

const purchaseOrderService = require("../../services/PurchaseOrderService");

async function create(req, res, next) {

  try{
    purchaseOrderService.create(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = create;