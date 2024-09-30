const ActivityTypeService = require("../../services/ActivityTypeService");

async function list(req, res, next) {

    ActivityTypeService.search(req,res,next);
}

module.exports = list;
