const RecurringActivityService = require("../../services/RecurringActivityService");
 
async function get(req, res, next) {
 try{
  await RecurringActivityService.getDetail(req, res, next);
 }catch(err){
    console.log(err);
 }
}
module.exports = get;