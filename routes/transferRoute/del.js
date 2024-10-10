const Permission = require("../../helpers/Permission");
const transferService = require("../../services/TransferService");

async function del(req, res, next) {

  try{
    transferService.del(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;