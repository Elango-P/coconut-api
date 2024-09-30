const LocationRackService = require("../../services/LocationRackService");

const create=async (req,res,next)=>{
    await LocationRackService.create(req,res,next);
}

module.exports = create;