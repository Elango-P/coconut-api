
const ActivityTypeService = require("../../services/ActivityTypeService");


async function updateStatus(req, res, next) {

    ActivityTypeService.updateStatus(req, res, next)
};


module.exports = updateStatus;
