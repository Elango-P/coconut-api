const {fineService} = require("../../services/FineBonusService");
const { paymentService } = require("../../services/PaymentService");

async function get(req, res, next) {
  try{
    fineService.get(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = get;