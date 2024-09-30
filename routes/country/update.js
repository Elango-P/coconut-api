// Module Dependencies
const Permission = require("../../helpers/Permission");
const CountryService = require("../../services/CountryService");


// Country update route
async function update (req, res, next) {
    const hasPermission = await Permission.Has(Permission.COUNTRY_EDIT, req);
 
    if (!hasPermission) {
  
      return res.json(400, { message: "Permission Denied"});
    }
  await CountryService.update(req, res)  
};

module.exports = update;