const AppService = require("../../services/AppService");


const create=async (req,res,next)=>{
    await AppService.create(req,res,next);
}
module.exports = create;