const statusService = require("../../services/StatusService");

async function updateSortOrder(req, res, next) {
  try{
    statusService.updateSortOrder(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = updateSortOrder;