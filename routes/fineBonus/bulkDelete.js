const { fineService } = require("../../services/FineBonusService");

async function bulkDelete(req, res, next) {

    try{
        fineService.bulkDelete(req, res, next)
    } catch(err){
        console.log(err);
    }
}

module.exports = bulkDelete;