
const RecurringActiviteService = require("../../services/RecurringActivityService");
 
async function search(req, res, next) {

 try{
  await RecurringActiviteService.search(req, res, next);
 }catch(err){
    console.log(err);
 }
}
module.exports = search;