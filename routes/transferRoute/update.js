const Permission = require("../../helpers/Permission");
const transferService = require("../../services/TransferService");

async function update(req, res, next) {
  // Validate Permission exist or not

  try{
    transferService.update(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = update;