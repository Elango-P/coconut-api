
// Utils
// Emails
const DataBaseService = require("../lib/dataBaseService");
const mailService = require("./MailService");
const MailConstants = require("../helpers/Setting");
const { getSettingValue } = require("./SettingService");
class MisMatchIpAddressService extends DataBaseService {
    async sendEmail(data, callback) {
        const companyId = data?.company_id
        try {
            const fromMail = await getSettingValue( MailConstants.FROM_EMAIL,  companyId);
            const userEmail = await getSettingValue(MailConstants.TECHNICAL_SUPPORT_EMAIL, companyId)
            const substitutions = {
                sendData: data
            }
            const emailData = {
                fromEmail: fromMail,
                toEmail: userEmail,
                subject: "Unknown Access",
                template: "unknownIPNotifiation",
                substitutions:substitutions
            };
          
            const params = { companyId: data?.company_id }
            mailService.sendMail(params, emailData)
        } catch (error) {
            console.log(error);
        }
    }
}
const misMatchIpAddressService = new MisMatchIpAddressService();
module.exports = misMatchIpAddressService;
