// Module Dependencies
const Permission = require("../../helpers/Permission");



// Library
const CountryService = require("../../services/CountryService");

// Country Delete Route
async function statedel (req, res, next) {

   await CountryService.stateDelete(req,res,next);
  }
module.exports = statedel;