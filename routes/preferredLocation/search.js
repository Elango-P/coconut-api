const PreferredLocationService = require("../../services/PreferredLocationService");


const search =async (req,res,next)=>{

    await PreferredLocationService.search(req,res,next)
}

module.exports=search;