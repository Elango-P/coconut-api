const { ActivityType } = require("../../db").models;
const History = require("../../services/HistoryService");
const Permission = require("../../helpers/Permission");
const ActivityTypeService = require("../../services/ActivityTypeService");


async function del(req, res, next) {

    ActivityTypeService.del(req, res, next)
};
module.exports = del;
