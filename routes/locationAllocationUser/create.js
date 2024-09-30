const LocationAllocationUserService = require("../../services/LocationAllocationUserService");


const create=async (req,res,next)=>{
    await LocationAllocationUserService.create(req,res,next)
    
}
module.exports=create;