const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const LeadService = require("../../services/LeadService");


async function del(req, res, next) {

  LeadService.del(req, res, next);
}

module.exports = del;