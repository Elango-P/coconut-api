
const transferService = require("../../services/TransferService");

async function get(req, res, next) {
  try{
    transferService.get(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = get;