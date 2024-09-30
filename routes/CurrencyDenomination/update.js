
const CurrencyDenominationService = require("../../services/CurrencyDenominationService");


const update =async (req,res,next)=>{
     await CurrencyDenominationService.update(req,res,next)
}
module.exports =update;