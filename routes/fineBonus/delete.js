const {fineService} = require("../../services/FineBonusService");
// const { paymentService } = require("../../services/paymentService");

async function del(req, res, next) {
  try{
    fineService.del(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;