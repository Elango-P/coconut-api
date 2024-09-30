const AppSettingService = require("../../services/AppSettingService")


const saveRoute =async (req,res,next)=>{
    await AppSettingService.save(req,res,next)
}
module.exports=saveRoute