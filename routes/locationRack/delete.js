const LocationRackService = require("../../services/LocationRackService");

const del=async (req,res,next)=>{
    await LocationRackService.delete(req,res,next);
}

module.exports = del;