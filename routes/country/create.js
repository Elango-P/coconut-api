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

   await CountryService.create(req, res) 
};
module.exports = create;
