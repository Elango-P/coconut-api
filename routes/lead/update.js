const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const LeadService = require("../../services/LeadService");


async function update(req, res, next) {
  const hasPermission = await Permission.Has(Permission.LEADS_EDIT, req);
  if (!hasPermission) {
    return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
  }
  LeadService.update(req, res, next);
}

module.exports = update;