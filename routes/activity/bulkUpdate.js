const activityService = require("../../services/ActivityService");

async function bulkUpdate(req, res, next) {

    try{
        activityService.bulkUpdate(req, res, next)
    } catch(err){
        console.log(err);
    }
}

module.exports = bulkUpdate;