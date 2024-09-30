const transferProductService = require("../../services/TransferProductService");
async function report(req, res, next) {
    try{
        transferProductService.report(req, res, next)
    } catch(err){
        console.log(err);
    }
}
module.exports = report;