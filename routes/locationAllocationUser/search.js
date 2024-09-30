const LocationAllocationUserService = require("../../services/LocationAllocationUserService");


const search=async (req,res,next)=>{
    await LocationAllocationUserService.search(req,res,next)
    
}
module.exports=search;