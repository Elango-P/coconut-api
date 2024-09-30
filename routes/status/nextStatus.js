
const statusService = require("../../services/StatusService");

async function nextStatus(req, res, next) {
  try{
    statusService.nextStatusSearch(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = nextStatus;