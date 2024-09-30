const AppVersionService = require("../../services/AppVersionService")


const update=async (req,res,next)=>{
    await AppVersionService.update(req,res,next);
}
module.exports = update;