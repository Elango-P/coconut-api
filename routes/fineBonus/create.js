const { fineService } = require("../../services/FineBonusService");

async function create(req, res, next) {
  try{
    fineService.create(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = create;
