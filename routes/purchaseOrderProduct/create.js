
const purchaseOrderProductService = require("../../services/PurchaseOrderProductService");

async function create(req, res, next) {
  try{
    purchaseOrderProductService.create(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = create;