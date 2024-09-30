const GatePassService = require("../../services/GatePassService");

async function get(req, res, next) {
  try{
    GatePassService.get(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = get;