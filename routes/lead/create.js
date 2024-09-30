const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const LeadService = require("../../services/LeadService");


async function create(req, res, next) {
  const hasPermission = await Permission.Has(Permission.LEADS_ADD, req);
  if (!hasPermission) {
    return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
  }
  LeadService.create(req, res, next);
}

module.exports = create;