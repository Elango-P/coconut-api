const AppService = require("../../services/AppService")


const search=async (req,res,next)=>{
    await AppService.search(req,res,next);
}
module.exports = search;