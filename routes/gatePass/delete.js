const Permission = require("../../helpers/Permission");
const GatePassService = require("../../services/GatePassService");


async function del(req, res, next) {
  try{

    GatePassService.del(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;