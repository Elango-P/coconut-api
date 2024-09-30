const LocationSalesGoalService = require("../../services/LocationSalesGoalService");


async function del(req, res, next) {
  try{
    LocationSalesGoalService.del(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;