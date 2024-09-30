const PageBlockFieldService = require("../../services/PageBlockFieldsService")


const del =async (req,res,next)=>{
await PageBlockFieldService.del(req,res,next)
}
module.exports=del