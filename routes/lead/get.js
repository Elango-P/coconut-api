const Response = require("../../helpers/Response");
const LeadService = require("../../services/LeadService");


async function get(req, res, next) {
  LeadService.get(req, res, next);
}

module.exports = get;