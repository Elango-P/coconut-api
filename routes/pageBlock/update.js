const PageBlockService = require("../../services/PageBlockService");


const update =async (req,res,next)=>{

    await PageBlockService.update(req,res,next);
}
module.exports =update;