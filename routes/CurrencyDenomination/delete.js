
const CurrencyDenominationService = require("../../services/CurrencyDenominationService");


const del =async (req,res,next)=>{
     await CurrencyDenominationService.del(req,res,next)
}
module.exports =del;