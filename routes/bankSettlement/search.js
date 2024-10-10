const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const BankSettlementService = require("../../services/BankSettlementService")

const search =async (req,res,next)=>{
   
    await BankSettlementService.search(req,res,next)
}

module.exports=search