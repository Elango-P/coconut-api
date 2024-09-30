const { fineService } = require("../../services/FineBonusService");


async function update(req, res, next) {

    try{
        fineService.update(req, res, next)
    } catch(err){
        console.log(err);
    }
}

module.exports = update;