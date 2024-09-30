const LocationAllocationUserService = require("../../services/LocationAllocationUserService");


const statusUpdate=async (req,res,next)=>{
    await LocationAllocationUserService.statusUpdate(req,res,next)
    
}
module.exports=statusUpdate;