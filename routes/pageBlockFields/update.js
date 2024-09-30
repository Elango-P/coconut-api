const PageBlockFieldService = require("../../services/PageBlockFieldsService")


const update =async (req,res,next)=>{
await PageBlockFieldService.update(req,res,next)
}
module.exports=update