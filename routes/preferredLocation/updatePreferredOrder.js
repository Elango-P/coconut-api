const PreferredLocationService = require("../../services/PreferredLocationService");


const updateSortOrder =async (req,res,next)=>{

    await PreferredLocationService.updateSortOrder(req,res,next)
}

module.exports=updateSortOrder;