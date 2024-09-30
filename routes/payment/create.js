const { paymentService } = require("../../services/PaymentService");

async function create(req, res, next) {
  try{
    paymentService.create(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = create;
