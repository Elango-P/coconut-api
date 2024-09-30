const { AccountAgreementService } = require("../../services/AccountAgreementService");

async function search(req, res, next) {
    try{
        AccountAgreementService.search(req, res, next)
    } catch(err){
        console.log(err);
    }
};

module.exports = search;