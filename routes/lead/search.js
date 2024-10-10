const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const LeadService = require("../../services/LeadService");


async function search(req, res, next) {

  LeadService.search(req, res, next);
}

module.exports = search;