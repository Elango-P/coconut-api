const DataBaseService = require("../lib/dataBaseService");
const mailService = require("./MailService");


class orderProductcancelledReportService extends DataBaseService{
async sendMail(params,data,callback){
      try {
         const emailSubstitutions={
           ...data
         } 

         const emailData={
            fromEmail:params.fromMail,
            toEmail:params.toMail,
            template:'orderProductCancelledReport',
            subject:`Cancelled Orders Product Report - ${data?.reportGeneratedAt}`,
            substitutions: emailSubstitutions,
         }
          // Sent Email
      mailService.sendMail(  params, emailData, async (err) => {
        if (err) {
          console.log(err);
        }


        return callback();
      });

      } catch (error) {
         console.log(error);
      }


}
}
const OrderProductcancelledReportService = new orderProductcancelledReportService

module.exports = OrderProductcancelledReportService;