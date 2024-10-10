const recurringService = require("../../services/RecurringTaskService");
const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");

const create = async (req, res) => {

  try{
  recurringService.create(req, res);
  }catch(err){
    console.log(err);
  }
};
module.exports = create;