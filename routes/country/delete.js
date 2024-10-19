// Module Dependencies
const Permission = require("../../helpers/Permission");


// Library
const CountryService = require("../../services/CountryService");

// Country Delete Route
async function del (req, res, next) {
    const hasPermission = await Permission.Has(Permission.COUNTRY_DELETE, req);
 
    if (!hasPermission) {
  
      return res.json(400, { message: "Permission Denied"});
    }
   await CountryService.delete(req,res,next);
  }
module.exports = del;