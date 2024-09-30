const PageBlockFieldService = require("../../services/PageBlockFieldsService")


const search =async (req,res,next)=>{
await PageBlockFieldService.search(req,res,next)
}
module.exports=search