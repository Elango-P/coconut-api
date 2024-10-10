const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const BankSettlementService = require("../../services/BankSettlementService")


const create =async (req,res,next)=>{
   
    await BankSettlementService.create(req,res,next)
}
module.exports=create