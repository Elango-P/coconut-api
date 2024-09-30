const LocationRackService = require("../../services/LocationRackService");

const search=async (req,res,next)=>{
    await LocationRackService.search(req,res,next);
}

module.exports = search;