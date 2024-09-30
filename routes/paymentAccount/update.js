
const paymentAccountService = require("../../services/PaymentAccountService");

async function update(req, res, next) {

  paymentAccountService.update(req, res, next)
}

module.exports = update;
