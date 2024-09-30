
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const { ActivityType } = require("../../db").models;

//systemLog
const ActivityTypeService = require("../../services/ActivityTypeService");

/**
 * Create Activity Type route
 */
async function create(req, res, next) {

    ActivityTypeService.create(req, res, next)
};

module.exports = create;
