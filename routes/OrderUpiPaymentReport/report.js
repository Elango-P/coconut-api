const OrderUpiPaymentReportService = require("../../services/OrderUpiPaymentReportService");


const orderUpiPaymentReport=async (req,res,next)=>{

    await OrderUpiPaymentReportService.report(req,res,next)

}
module.exports=orderUpiPaymentReport;