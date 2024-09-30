const PageBlockService = require("../../services/PageBlockService");


const create =async (req,res,next)=>{

    await PageBlockService.create(req,res,next);
}
module.exports =create;