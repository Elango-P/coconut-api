
const ActivityService = require("../../services/ActivityService");

const updateStatus=async (req,res,next)=>{
    await ActivityService.updateStatus(req,res,next)
}

module.exports = updateStatus;