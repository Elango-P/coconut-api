const Permission = require("../../helpers/Permission");
const GatePassService = require("../../services/GatePassService");

async function create(req, res, next) {
    try{

    GatePassService.create(req, res, next)
  } catch(err){
      console.log(err);
  }
  };
  
  module.exports = create;