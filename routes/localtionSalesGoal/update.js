const LocationSalesGoalService = require("../../services/LocationSalesGoalService");



async function update(req, res, next) {

    try{
        LocationSalesGoalService.update(req, res, next)
    } catch(err){
        console.log(err);
    }
}

module.exports = update;