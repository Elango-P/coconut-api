const recurringService = require("../../services/RecurringTaskService");
const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");

const update = async (req, res) => {

  try{
  recurringService.update(req, res);
  }catch(err){
    console.log(err);
  }
};
module.exports = update;