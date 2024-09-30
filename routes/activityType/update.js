
const ActivityTypeService = require("../../services/ActivityTypeService");


async function update(req, res, next) {

    ActivityTypeService.update(req, res, next)
};
module.exports = update;
