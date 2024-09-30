const activityService = require("../../services/ActivityService");

async function list(req, res, next) {

    activityService.search(req,res,next);
}

module.exports = list;
