const recurringService = require("../../services/RecurringTaskService");
const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");

const del = async (req, res) => {

  try{
  recurringService.del(req, res);
  }catch(err){
    console.log(err);
  }
};
module.exports = del;