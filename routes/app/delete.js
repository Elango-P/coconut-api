const AppService = require("../../services/AppService")


const del=async (req,res,next)=>{
    await AppService.del(req,res,next);
}
module.exports = del;