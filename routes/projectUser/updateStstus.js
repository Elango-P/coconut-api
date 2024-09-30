const projectUserService = require("../../services/ProjectUserService");



  async function updateStatus (req, res, next){
    try{
       await projectUserService.updateStatus(req,res,next);
        }catch(err){
        console.log(err);
    }
 };
 module.exports = updateStatus;
 