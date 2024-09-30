const { paymentService } = require("../../services/PaymentService");

async function search(req, res, next) {
    try{
        paymentService.search(req, res, next)
    } catch(err){
        console.log(err);
    }
};

module.exports = search;