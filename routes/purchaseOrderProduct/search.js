
const purchaseOrderProductService = require("../../services/PurchaseOrderProductService");


const search = async (req, res,next) => {
    try{
        purchaseOrderProductService.search(req, res, next)
    } catch(err){
        console.log(err);
    }
};

module.exports = search;
