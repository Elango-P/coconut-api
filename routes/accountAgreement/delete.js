const { AccountAgreementService } = require("../../services/AccountAgreementService");

async function del(req, res, next) {
  try{
    AccountAgreementService.del(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;