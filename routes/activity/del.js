const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const activityService = require("../../services/ActivityService");


async function del(req, res, next) {
    const hasPermission = await Permission.Has(Permission.ACTIVITY_DELETE, req);

  if (!hasPermission) {

      return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
  }

    activityService.del(req, res, next)
};
module.exports = del;
