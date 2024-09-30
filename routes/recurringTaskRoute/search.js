
const Permission = require("../../helpers/Permission");
const recurringService = require("../../services/RecurringTaskService");

 
async function search(req, res, next) {
   const hasPermission = await Permission.Has(Permission.RECURRING_TASK_VIEW, req);
  if (!hasPermission) {
      return res.json(400, { message: "Permission Denied" });
  }
 try{
  recurringService.search(req, res, next);
 }catch(err){
    console.log(err);
 }
}
module.exports = search;