const LocationSalesGoalService = require("../../services/LocationSalesGoalService");


async function search(req, res, next) {
    try{
        await LocationSalesGoalService.search(req, res, next)
    } catch(err){
        
        console.log(err);
    }
};

module.exports = search;