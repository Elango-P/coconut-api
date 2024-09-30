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
        ...req.params
    }

   let responce =  await AttendanceTypeService.update(params);
   if(responce){
    res.json(OK, { message: 'Account Type Updated', id: responce[0] });
    res.on('finish', async () => {
      History.create("Account Type Updated", req, ObjectName.ATTENDANCE_TYPE, responce[0]);
    });
   }
}

module.exports = create