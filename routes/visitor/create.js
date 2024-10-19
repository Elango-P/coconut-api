
const Permission = require("../../helpers/Permission");
const VisitorService  = require("../../services/VisitorService");

async function create(req, res, next) {
    try{
        const hasPermission = await Permission.Has(Permission.VISITOR_ADD, req);
    if (!hasPermission) {
      return res.json(400, { message: "Permission Denied" });
    }
        VisitorService.create(req, res, next)
  } catch(err){
      console.log(err);
  }
  };
  
  module.exports = create;