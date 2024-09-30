
const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const AccountService = require("../../services/AccountService")


  async function updateStatus (req, res, next){
    const hasPermission = await Permission.Has(Permission.VENDOR_STATUS_UPDATE, req);
 
    if (!hasPermission) {
  
      return res.json(Response.BAD_REQUEST, { message: "Permission Denied"});
    }
    try{
        
        AccountService.updateStatus(req, res,next)
    }catch(err){
        console.log(err);
    }
 };
 module.exports = updateStatus;
 