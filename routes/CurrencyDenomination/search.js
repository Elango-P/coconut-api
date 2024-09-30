
const CurrencyDenominationService = require("../../services/CurrencyDenominationService");


const search =async (req,res,next)=>{
     await CurrencyDenominationService.search(req,res,next)
}
module.exports =search;