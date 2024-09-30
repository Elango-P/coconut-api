const Permission = require("../../helpers/Permission");
const transferService = require("../../services/TransferService");

async function bulkUpdate(req, res, next) {

  try{
    transferService.bulkUpdate(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = bulkUpdate;