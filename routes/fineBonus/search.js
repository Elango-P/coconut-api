const { fineService } = require("../../services/FineBonusService");

async function search(req, res, next) {
    try{
        fineService.search(req, res, next)
    } catch(err){
        
        console.log(err);
    }
};

module.exports = search;