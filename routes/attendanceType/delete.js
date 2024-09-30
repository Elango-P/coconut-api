const { typeOptions } = require("../../helpers/AttendanceType");
const ObjectName = require("../../helpers/ObjectName");
const Response = require("../../helpers/Response");
const { OK } = require("../../helpers/Response");
const Request = require("../../lib/request")
const AttendanceTypeService = require("../../services/AttendanceTypeService");
const History = require("../../services/HistoryService");



const del =async (req,res,next)=>{

    let companyId = Request.GetCompanyId(req);
    if (!companyId) {
        return res.json(Response.BAD_REQUEST, "Company Not Found");
      }
    let params={
        company_id: companyId,
        ...req.params
    }

   let responce =  await AttendanceTypeService.delete(params,res);
   let typeName = typeOptions.find((data)=> data?.value == responce?.type)
   if(responce){
    res.json(OK, { message: `Attendance ${typeName && typeName?.label} Deleted`, id: req.params?.id });
    res.on('finish', async () => {
      History.create(`Attendance ${typeName && typeName?.label} Deleted `, req, ObjectName.ATTENDANCE_TYPE, req.params?.id);
    });
   }
}

module.exports = del