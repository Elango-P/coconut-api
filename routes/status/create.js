
const statusService = require("../../services/StatusService");

async function create(req, res, next) {
  try{
    statusService.create(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = create;