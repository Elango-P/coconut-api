const { AccountAgreementService } = require("../../services/AccountAgreementService");


async function update(req, res, next) {

    try{
        AccountAgreementService.update(req, res, next)
    } catch(err){
        console.log(err);
    }
}

module.exports = update;