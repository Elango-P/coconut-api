
const statusService = require("../../services/StatusService");

async function get(req, res, next) {
  try{
    statusService.get(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = get;