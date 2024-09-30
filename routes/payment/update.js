const { paymentService } = require("../../services/PaymentService");


async function update(req, res, next) {

    try{
        paymentService.update(req, res, next)
    } catch(err){
        console.log(err);
    }
}

module.exports = update;