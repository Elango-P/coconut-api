const AppVersionService = require("../../services/AppVersionService")


const del =async (req,res,next)=>{
    await AppVersionService.delete(req,res,next);
}
module.exports = del;