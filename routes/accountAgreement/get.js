const { AccountAgreementService } = require("../../services/AccountAgreementService");

async function get(req, res, next) {
  try{
    AccountAgreementService.get(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = get;