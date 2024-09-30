const AppVersionService = require("../../services/AppVersionService")


const search=async (req,res,next)=>{
    await AppVersionService.search(req,res,next);
}
module.exports = search;