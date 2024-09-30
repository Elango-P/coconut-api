const RecurringActivityService = require("../../services/RecurringActivityService");

const create = async (req, res) => {
  try{
  await RecurringActivityService.create(req, res);
  }catch(err){
    console.log(err);
  }
};
module.exports = create;