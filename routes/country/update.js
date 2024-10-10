// Module Dependencies
const Permission = require("../../helpers/Permission");
const CountryService = require("../../services/CountryService");


// Country update route
async function update (req, res, next) {

  await CountryService.update(req, res)  
};

module.exports = update;