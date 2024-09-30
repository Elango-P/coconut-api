const PageBlockFieldService = require("../../services/PageBlockFieldsService")


const create =async (req,res,next)=>{
await PageBlockFieldService.create(req,res,next)
}
module.exports=create