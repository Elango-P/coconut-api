const Permission = require("../../helpers/Permission");

const schedulerService = require("../../services/SchedulerService");


async function list(req, res, next) {


  schedulerService.search(req, res,next);
    
    
    
}

module.exports = list;
