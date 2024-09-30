const transferProductService = require("../../services/TransferProductService");
async function Clone(req, res, next) {
    try{
        transferProductService.clone(req, res, next)
    } catch(err){
        console.log(err);
    }
}
module.exports = Clone;