
const statusService = require("../../services/StatusService");

async function update(req, res, next) {
  try{
    statusService.update(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = update;