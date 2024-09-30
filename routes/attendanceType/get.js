const Response = require("../../helpers/Response");
const { OK } = require("../../helpers/Response");
const Request = require("../../lib/request")
const AttendanceTypeService = require("../../services/AttendanceTypeService");



const get =async (req,res,next)=>{

    let companyId = Request.GetCompanyId(req);
    if (!companyId) {
        return res.json(Response.BAD_REQUEST, "Company Not Found");
      }
    let params={
        company_id: companyId,
        ...req.params
    }
   let responce =  await AttendanceTypeService.get(params);
   if(responce){
    res.json(OK, { data: responce });
   }
}

module.exports = get