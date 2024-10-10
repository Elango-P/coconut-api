
const Permission = require("../../helpers/Permission");
const VisitorService  = require("../../services/VisitorService");

async function create(req, res, next) {
    try{
 
        VisitorService.create(req, res, next)
  } catch(err){
      console.log(err);
  }
  };
  
  module.exports = create;