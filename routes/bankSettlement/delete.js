const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const BankSettlementService = require("../../services/BankSettlementService")

const del =async (req,res,next)=>{
    const hasPermission = await Permission.Has(Permission.BANK_SETTLEMENT_DELETE, req);

    if (!hasPermission) {

        return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
    }

    await BankSettlementService.delete(req,res,next)

}
module.exports=del