const LocationAllocationUserService = require("../../services/LocationAllocationUserService");

const leaveList=async (req,res,next)=>{
    await LocationAllocationUserService.leaveList(req,res,next)
}
module.exports=leaveList;