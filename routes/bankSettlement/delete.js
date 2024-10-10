const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const BankSettlementService = require("../../services/BankSettlementService")

const del =async (req,res,next)=>{
    

    await BankSettlementService.delete(req,res,next)

}
module.exports=del