
const transferService = require("../../services/TransferService");

async function bulkReplenish(req, res, next) {
  try{
    transferService.bulkReplenish(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = bulkReplenish;