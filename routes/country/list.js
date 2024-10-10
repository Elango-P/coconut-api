const Permission = require("../../helpers/Permission");


// Library
const CountryService = require("../../services/CountryService");

// Country Delete Route
async function list (req, res, next) {
 

   await CountryService.list(req,res,next);
  }
module.exports = list;