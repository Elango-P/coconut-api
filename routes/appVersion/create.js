const AppVersionService = require("../../services/AppVersionService")


const create=async (req,res,next)=>{
    await AppVersionService.create(req,res,next);
}
module.exports = create;