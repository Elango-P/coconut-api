const LocationAllocationUserService = require("../../services/LocationAllocationUserService");


const resetToDefault=async (req,res,next)=>{
    await LocationAllocationUserService.resetToDefault(req,res,next)
    
}
module.exports=resetToDefault;