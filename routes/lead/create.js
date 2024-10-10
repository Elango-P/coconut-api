const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const LeadService = require("../../services/LeadService");


async function create(req, res, next) {

  LeadService.create(req, res, next);
}

module.exports = create;