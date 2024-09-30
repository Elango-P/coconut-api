const PreferredLocationService = require("../../services/PreferredLocationService");


const del =async (req,res,next)=>{

    await PreferredLocationService.del(req,res,next)
}

module.exports=del;