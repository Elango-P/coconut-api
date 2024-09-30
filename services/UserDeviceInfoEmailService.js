//Lib
const ObjectName = require('../helpers/ObjectName');
const DataBaseService = require("../lib/dataBaseService");
const { getSettingValue } = require('./SettingService');
const MailConstants = require("../helpers/Setting");
const mailService = require('./MailService');
const { User } = require('../db').models;



class UserDeviceinfoEmailService  extends DataBaseService {
  async sendEmail( status,companyId,userId) {
    try {
      const fromMail = await getSettingValue(
        MailConstants.FROM_EMAIL,
        companyId
    );
    const userEmail = await User.findOne({
      where: { id: userId,company_id: companyId},
      attributes: ["email"]
    });

    const substitutions = {
      status: status
  }
     
        const emailData = {
          fromEmail:fromMail,
          toEmail: userEmail?.dataValues?.email,
          subject: "Device Status",
          template: "userDeviceInfoNotification", 
          substitutions: substitutions,
      };
        
        let param={companyId:companyId}
        mailService.sendMail(param,emailData)
    }catch(err){
        console.log(err);
    }
    
  }
}
const userDeviceinfoEmailService = new UserDeviceinfoEmailService();
module.exports = userDeviceinfoEmailService;

