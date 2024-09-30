const AttendanceService = require("../../services/AttendanceService")


const monthRecord =async (req,res,next)=>{
    await AttendanceService.monthRecord(req,res,next)
}

module.exports =monthRecord