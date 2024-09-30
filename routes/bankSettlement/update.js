const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const BankSettlementService = require("../../services/BankSettlementService")

const update =async (req,res,next)=>{
    const hasPermission = await Permission.Has(Permission.BANK_SETTLEMENT_EDIT, req);

    if (!hasPermission) {

        return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
    }
await BankSettlementService.update(req,res,next)
}

module.exports=update