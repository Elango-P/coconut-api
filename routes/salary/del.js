const Permission = require("../../helpers/Permission");
const SalaryService = require("../../services/SalaryService");


const del =async (req,res,next)=>{

    await SalaryService.del(req,res,next)

}

module.exports=del;