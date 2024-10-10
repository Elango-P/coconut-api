// Module Dependencies
const Permission = require("../../helpers/Permission");


// Library
const CountryService = require("../../services/CountryService");

// Country Delete Route
async function del (req, res, next) {

   await CountryService.delete(req,res,next);
  }
module.exports = del;