
const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const activityService = require("../../services/ActivityService");


async function update(req, res, next) {
   
    activityService.update(req, res, next)
};
module.exports = update;
