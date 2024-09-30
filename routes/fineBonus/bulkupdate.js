const { fineService } = require("../../services/FineBonusService");


async function bulkupdate(req, res, next) {

    try{
        fineService.bulkupdate(req, res, next)
    } catch(err){
        console.log(err);
    }
}

module.exports = bulkupdate;