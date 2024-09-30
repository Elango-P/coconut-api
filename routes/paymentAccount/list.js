
const paymentAccountService = require("../../services/PaymentAccountService");

//Lib
const Request = require("../../lib/request");

async function List(req, res, next) {
    paymentAccountService.list(req, res, next) 

}

module.exports = List;