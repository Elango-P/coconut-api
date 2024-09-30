
const Permission = require("../../helpers/Permission");
const recurringService = require("../../services/RecurringTaskService");

 
async function search(req, res, next) {
 try{
  recurringService.getdetail(req, res, next);
 }catch(err){
    console.log(err);
 }
}
module.exports = search;