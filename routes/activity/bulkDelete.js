const activityService = require("../../services/ActivityService");


async function bulkDelete(req, res, next) {

    activityService.bulkDelete(req, res, next)
};
module.exports = bulkDelete;
