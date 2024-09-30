const RecurringActivityService = require("../../services/RecurringActivityService");

const del = async (req, res) => {
  try{
  await RecurringActivityService.del(req, res);
  }catch(err){
    console.log(err);
  }
};
module.exports = del;