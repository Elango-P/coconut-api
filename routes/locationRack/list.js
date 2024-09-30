const LocationRackService = require("../../services/LocationRackService");

const list=async (req,res,next)=>{
    await LocationRackService.list(req,res,next);
}

module.exports = list;