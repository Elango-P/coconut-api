
const statusService = require("../../services/StatusService");

async function search(req, res, next) {
  try{
    statusService.search(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = search;