const DataBaseService = require("../lib/dataBaseService");
const mailService = require("./MailService");


class cancelledOrderNotification extends DataBaseService{
async sendMail(params,data,callback){
      try {
         const emailSubstitutions={
           ...data
         } 

         const emailData={
            fromEmail:params.fromMail,
            toEmail:params.toMail,
            template:'cancelledOrderReport',
            subject:`Cancelled Orders Report - ${data?.reportGeneratedAt}`,
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
const CancelledOrderNotification = new cancelledOrderNotification

module.exports = CancelledOrderNotification;