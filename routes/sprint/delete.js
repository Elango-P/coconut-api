const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const { sprintService } = require("../../services/SprintService ");


const del = async (req, res) => {
    const hasPermission = await Permission.Has(Permission.SPRINT_DELETE, req);
    if (!hasPermission) {
      return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
    }
    sprintService.del(req,res);
}

module.exports = del;