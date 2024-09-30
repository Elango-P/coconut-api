
const paymentAccountService = require("../../services/PaymentAccountService");

async function del(req, res, next) {
paymentAccountService.del(req, res, next);
    
}

module.exports = del;
