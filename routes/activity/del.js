const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const activityService = require("../../services/ActivityService");


async function del(req, res, next) {
  

    activityService.del(req, res, next)
};
module.exports = del;
