const PageBlockService = require("../../services/PageBlockService");


const del =async (req,res,next)=>{

    await PageBlockService.del(req,res,next);
}
module.exports =del;