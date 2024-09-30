
// Utils
// Emails
const DataBaseService = require("../lib/dataBaseService");
const { randomString } = require("../lib/utils");
const { companyService } = require("./CompanyService");
const mailService = require("./MailService");
const { User } = require("../db").models;
const MailConstants = require("../helpers/Setting");
const { getSettingValue } = require("./SettingService");
class ForgotPasswordEmailService extends DataBaseService {
    async sendEmail(req, userEmail,callback) {
        try {
            //check user
            User.findOne({
                where: { email: userEmail },
                
            }).then(userDetails => {
                if (!userDetails) {
                    return callback("Email is not registered");
                }
                let passwordToken;
                let companyId;
                if (userDetails && userDetails.token) {
                    // if there user detail and password token
                    passwordToken = userDetails.token;
                }
                if(userDetails && userDetails.company_id){
                    companyId= userDetails?.company_id
                }
                else if (userDetails && !userDetails.token) {
                    passwordToken = randomString;
                }
                userDetails
                    .update({ password_token: passwordToken },{ where:  { email: userEmail }, } )
                    .then(async () => {
                        // Send Forgot Password Email
                        const companyDetails = await companyService.findOne({
                            where: { id:companyId },
                            attributes: { exclude: ["deletedAt"] },
                        });
                        const portalBaseUrl = companyDetails. portal_url;
                        const emailSubstitutions = {
                            resetUrl: `${portalBaseUrl}/set-password?token=${passwordToken}&email=${userEmail}`,
                            firstName: userDetails.name,
                        };
                        const fromMail = await getSettingValue(
                            MailConstants.FROM_EMAIL,
                            companyId
                        );
                    
                        //Email Data
                        const emailData = {
                            fromEmail:fromMail,
                            toEmail: userEmail,
                            subject: "Reset password",
                            template: "setPassword",
                            
                            substitutions: emailSubstitutions,
                        };
                        const params={companyId: companyId,}
                        //Sent Email
                        mailService.sendMail(params, emailData, () => {
                            return  callback &&callback(null)
                        });
                    });
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
const forgotPasswordEmailService = new ForgotPasswordEmailService();
module.exports = forgotPasswordEmailService;
