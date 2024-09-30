const PreferredLocationService = require("../../services/PreferredLocationService");


const create =async (req,res,next)=>{

    await PreferredLocationService.create(req,res,next);
}
module.exports =create;