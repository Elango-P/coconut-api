const AppService = require("../../services/AppService")


const get=async (req,res,next)=>{
    await AppService.get(req,res,next);
}
module.exports = get;