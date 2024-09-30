const paymentAccountService = require("../../services/PaymentAccountService");

//Lib
const Request = require("../../lib/request");

async function Get(req, res, next) {
 paymentAccountService.get(req, res, next)
}

module.exports = Get;
