const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const BankSettlementService = require("../../services/BankSettlementService")

const update =async (req,res,next)=>{
    
await BankSettlementService.update(req,res,next)
}

module.exports=update