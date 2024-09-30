
const paymentAccountService = require("../../services/PaymentAccountService");

//Lib
const Request = require("../../lib/request");

async function search(req, res, next) {
    paymentAccountService.search(req, res, next) 

}

module.exports = search;