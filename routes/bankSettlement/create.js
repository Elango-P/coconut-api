const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const BankSettlementService = require("../../services/BankSettlementService")


const create =async (req,res,next)=>{
    const hasPermission = await Permission.Has(Permission.BANK_SETTLEMENT_ADD, req);

    if (!hasPermission) {

        return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
    }
    await BankSettlementService.create(req,res,next)
}
module.exports=create