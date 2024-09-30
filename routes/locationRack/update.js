const LocationRackService = require("../../services/LocationRackService");

const update=async (req,res,next)=>{
    await LocationRackService.update(req,res,next);
}

module.exports = update;