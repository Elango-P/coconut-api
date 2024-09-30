
const activityService = require("../../services/ActivityService");

/**
 * Create Activity Type route
 */
async function get(req, res, next) {

    activityService.get(req, res, next)
};
module.exports = get;
