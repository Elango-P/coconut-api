const AppService = require("../../services/AppService")


const update=async (req,res,next)=>{
    await AppService.update(req,res,next);
}
module.exports = update;