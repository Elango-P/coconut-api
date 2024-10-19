const Permission = require("../../helpers/Permission");
const GatePassService = require("../../services/GatePassService");

async function create(req, res, next) {
    try{
        const hasPermission = await Permission.Has(Permission.GATE_PASS_ADD, req);
    if (!hasPermission) {
      return res.json(400, { message: "Permission Denied" });
    }
    GatePassService.create(req, res, next)
  } catch(err){
      console.log(err);
  }
  };
  
  module.exports = create;