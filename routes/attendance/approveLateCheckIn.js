const AttendanceService = require("../../services/AttendanceService")


const ApproveLateCheckIn =async (req,res,next)=>{
    await AttendanceService.ApproveLateCheckIn(req,res,next)
}

module.exports =ApproveLateCheckIn