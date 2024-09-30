const { AccountAgreementService } = require('../../services/AccountAgreementService');

async function create(req, res, next) {
  try {
    AccountAgreementService.create(req, res, next);
  } catch (err) {
    console.log(err);
  }
}

module.exports = create;
