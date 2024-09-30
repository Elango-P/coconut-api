
const purchaseOrderProductService = require("../../services/PurchaseOrderProductService");


const update = async (req, res,next) => {
    try{
        purchaseOrderProductService.update(req, res, next)
    } catch(err){
        console.log(err);
    }
};

module.exports = update;
