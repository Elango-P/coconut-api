
const Permission = require("../../helpers/Permission");


// // Models
// const { SchedulerJob } = require("../../db").models;
const schedulerService = require("../../services/SchedulerService");

async function create(req, res, next) {


   schedulerService.create(req, res);

  
}

module.exports = create;
