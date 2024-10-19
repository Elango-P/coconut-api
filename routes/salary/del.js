const Permission = require("../../helpers/Permission");
const SalaryService = require("../../services/SalaryService");


const del =async (req,res,next)=>{
    const hasPermission = await Permission.Has(Permission.SALARY_DELETE, req);
    if (!hasPermission) {
      return res.json(400, { message: "Permission Denied" });
    }
    await SalaryService.del(req,res,next)

}

module.exports=del;