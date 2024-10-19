const recurringService = require("../../services/RecurringTaskService");
const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");

const create = async (req, res) => {
  const hasPermission = await Permission.Has(Permission.RECURRING_TASK_ADD, req);
  if (!hasPermission) {
      return res.json(400, { message: "Permission Denied" });
  }
  try{
  recurringService.create(req, res);
  }catch(err){
    console.log(err);
  }
};
module.exports = create;