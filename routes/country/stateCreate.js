/**
 * Module dependencies
 */
// Status
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const Permission = require("../../helpers/Permission");

// Services
const { Country } = require("../../db").models;
const Request = require("../../lib/request");
const CountryService = require("../../services/CountryService");

/**
 * Customer create route
 */
 async function create (req, res, next){
    const hasPermission = await Permission.Has(Permission.COUNTRY_EDIT, req);
 
    if (!hasPermission) {
  
      return res.json(400, { message: "Permission Denied"});
    }
   await CountryService.stateCreate(req, res) 
};
module.exports = create;
