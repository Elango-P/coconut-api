const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const BankSettlementService = require("../../services/BankSettlementService")

const search =async (req,res,next)=>{
    const hasPermission = await Permission.Has(Permission.BANK_SETTLEMENT_VIEW, req);

    if (!hasPermission) {

        return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
    }
    await BankSettlementService.search(req,res,next)
}

module.exports=search