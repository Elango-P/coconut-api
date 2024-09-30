
const statusService = require("../../services/StatusService");

async function del(req, res, next) {
  try{
    statusService.del(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;