
const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const { sprintService } = require("../../services/SprintService ");


/**
 * Sprint update route
 */
async function update(req, res, next) {
    const hasPermission = await Permission.Has(Permission.SPRINT_EDIT, req);
    if (!hasPermission) {
      return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
    }
 sprintService.update(req,res,next);
};

module.exports = update;