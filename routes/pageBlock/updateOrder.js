const PageBlockService = require("../../services/PageBlockService");


const updateSortOrder =async (req,res,next)=>{

    await PageBlockService.updateSortOrder(req,res,next);
}
module.exports =updateSortOrder;