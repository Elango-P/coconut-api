/**
 * Module dependencies
 */
const { BAD_REQUEST, UPDATE_SUCCESS } = require("../../helpers/Response");
const {  ACTIVE_STATUS,IN_ACTIVE_STATUS } = require("../../helpers/ProjectUser")

// Models
const { Project } = require("../../db").models;

//systemLog
const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");
const Date = require("../../lib/dateTime");

const allowManualLogin = require("../user/allowManualLogin");
const Number = require("../../lib/Number");
const projectService = require("../../services/ProjectService");


/**
 * Sprint update route
 */
async function update(req, res, next) {
     projectService.update(req,res,next);
};

module.exports = update;
