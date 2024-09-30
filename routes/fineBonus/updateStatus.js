const Response = require("../../helpers/Response");
const { fineService } = require("../../services/FineBonusService");
const Permission = require("../../helpers/Permission");



async function updateStatus(req, res, next) {
    const hasStatusUpdatePermission = await Permission.Has(Permission.FINE_STATUS_UPDATE, req);

    if (!hasStatusUpdatePermission) {
  
        return res.json(Response.BAD_REQUEST, { message: "Permission Denied"});
      }


    try{
        fineService.updateStatus(req, res, next)
    } catch(err){
        console.log(err);
    }
}
module.exports = updateStatus;
