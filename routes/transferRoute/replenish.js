
const transferService = require("../../services/TransferService");

async function replenish(req, res, next) {
  try{
    transferService.replenish(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = replenish;