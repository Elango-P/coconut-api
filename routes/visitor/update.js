const Permission = require("../../helpers/Permission");
const VisitorService  = require("../../services/VisitorService");



async function update(req, res, next) {

    try{
        const hasPermission = await Permission.Has(Permission.VISITOR_EDIT, req);
        if (!hasPermission) {
          return res.json(400, { message: "Permission Denied" });
        }
        VisitorService.update(req, res, next)
    } catch(err){
        console.log(err);
    }
}

module.exports = update;