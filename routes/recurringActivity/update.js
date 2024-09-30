const RecurringActivityService = require("../../services/RecurringActivityService");

const update = async (req, res) => {

  try{
  await RecurringActivityService.update(req, res);
  }catch(err){
    console.log(err);
  }
};
module.exports = update;