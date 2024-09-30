const PreferredLocationService = require("../../services/PreferredLocationService");


const update =async (req,res,next)=>{

    await PreferredLocationService.update(req,res,next)
}

module.exports=update;