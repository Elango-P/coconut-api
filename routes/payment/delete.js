const { paymentService } = require("../../services/PaymentService");

async function del(req, res, next) {
  try{
    paymentService.del(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;