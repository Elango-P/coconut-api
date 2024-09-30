
const ActivityTypeService = require("../../services/ActivityTypeService");

/**
 * Create Activity Type route
 */
async function get(req, res, next) {

    ActivityTypeService.get(req, res, next)
};
module.exports = get;
