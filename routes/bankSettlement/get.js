const BankSettlementService = require("../../services/BankSettlementService")

const get=async (req,res,next)=>{
    await BankSettlementService.get(req,res,next)
}
module.exports=get