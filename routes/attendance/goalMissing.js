const AttendanceService = require("../../services/AttendanceService")


const GoalMissing =async (req,res,next)=>{
    await AttendanceService.GoalMissing(req,res,next)
}

module.exports =GoalMissing