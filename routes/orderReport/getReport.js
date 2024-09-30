const Response = require("../../helpers/Response");
const Request = require("../../lib/request")
const OrderReportService = require("../../services/OrderReportService")

const getReport=async (req,res,next)=>{
    let companyId = Request.GetCompanyId(req);
    let timeZone = Request.getTimeZone(req);

    let params = {
        ...req.query,
        companyId: companyId,
        timeZone: timeZone
    }
 
   let data =  await OrderReportService.getReport(params, res)
   if(data){
       res.json(Response.OK, data);
   }

}

module.exports=getReport;