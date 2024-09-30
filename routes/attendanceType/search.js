const Response = require("../../helpers/Response");
const { OK } = require("../../helpers/Response");
const Request = require("../../lib/request")
const AttendanceTypeService = require("../../services/AttendanceTypeService");



const search =async (req,res,next)=>{

    let companyId = Request.GetCompanyId(req);
    if (!companyId) {
        return res.json(Response.BAD_REQUEST, "Company Not Found");
      }
    let params={
        company_id: companyId,
        ...req.query
    }

   let responce =  await AttendanceTypeService.search(params,res);
   if(responce){
    res.json(OK, {...responce});
   }
}

module.exports = search