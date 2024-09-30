// Module Dependencies
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const CountryService = require("../../services/CountryService");

// Models
const { Country, State } = require("../../db").models;


// Country get route
async function get (req, res, next) {
await CountryService.get(req, res)   
};

module.exports = get;