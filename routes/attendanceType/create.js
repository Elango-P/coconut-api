const ObjectName = require("../../helpers/ObjectName");
const Response = require("../../helpers/Response");
const { OK } = require("../../helpers/Response");
const Request = require("../../lib/request")
const AttendanceTypeService = require("../../services/AttendanceTypeService");
const History = require("../../services/HistoryService");



const create =async (req,res,next)=>{

    let companyId = Request.GetCompanyId(req);
    if (!companyId) {
        return res.json(Response.BAD_REQUEST, "Company Not Found");
      }

    let params={
        company_id: companyId,
        ...req.body
    }

   let responce =  await AttendanceTypeService.create(params);

   if(responce){
    res.json(OK, { message: `Attendance ${req.body.type_name} added`, id: responce?.id });
    res.on('finish', async () => {
      History.create(`Attendance ${req.body.type_name} added `, req, ObjectName.ATTENDANCE_TYPE, responce?.id);
    });
   }
}

module.exports = create