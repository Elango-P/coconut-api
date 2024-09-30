const LocationSalesGoalService = require("../../services/LocationSalesGoalService");

async function create(req, res, next) {
    try{
        LocationSalesGoalService.create(req, res, next)
  } catch(err){
      console.log(err);
  }
  };
  
  module.exports = create;