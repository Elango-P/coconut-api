const AppSettingService = require("../../services/AppSettingService")


const getRoute =async (req,res,next)=>{
    await AppSettingService.get(req,res,next)
}
module.exports=getRoute