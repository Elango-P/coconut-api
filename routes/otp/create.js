const ObjectName = require("../../helpers/ObjectName");
const Request = require("../../lib/request");
const mailService = require("../../services/MailService");
const OTPService = require("../../services/OTPService");
const { getSettingValue } = require("../../services/SettingService");
const MailConstants = require("../../helpers/Setting");
const { getUserDetailById } = require("../../services/UserService");
const { concatName } = require("../../lib/string");
const Otp = require("../../helpers/Otp.");
const Number = require("../../lib/Number");
const DateTime = require("../../lib/dateTime");
const { Op } = require("sequelize");
const { UserDeviceInfo,Otp:OtpModel } = require('../../db').models;

const create = async (req, res, next) => {
    let companyId = Request.GetCompanyId(req);
    let userId = Request.getUserId(req);

    try{
    const fromMail = await getSettingValue(MailConstants.FROM_EMAIL, companyId);
    const locationChangeNotificationEmail = await getSettingValue(MailConstants.LOCATION_CHANGE_NOTIFICATION_EMAIL, companyId);

    let userDetail = await getUserDetailById(userId, companyId);
    let deviceName 
    if (Number.isNotNull(req && req.params && req.params?.deviceName)) {
        deviceName = req && req.params && req.params?.deviceName;
      }
      let deviceInfoDetail = await UserDeviceInfo.findOne({
        attributes: ["id"],
        where: {
         device_name : deviceName,
          user_id: userId,
          company_id: companyId,
        },
      });   
       let params = {
        companyId: companyId,
        objectId: deviceInfoDetail && deviceInfoDetail?.id,
        objectName: ObjectName.USER,
        type: Otp.TYPE_LOCATION_CHANGE_REQUEST,
    };
    let response;
    let otpData = await OtpModel.findOne({
      where: {
        type: Otp.TYPE_LOCATION_CHANGE_REQUEST,
        object_name: ObjectName.USER,
        object_id: deviceInfoDetail && deviceInfoDetail?.id,
        company_id: companyId,
        used_at: { [Op.eq]: null },
      },
      order: [["createdAt", "DESC"]],
    });
    if (otpData) {
      if (DateTime.compareTimeByMinutes(otpData?.createdAt, 15)) {
        response = await OTPService.create(params);
      } else {
        response = otpData;
      }
    } else {
      response = await OTPService.create(params);
    }

    const emailSubstitutions = {
        verificationCode: response?.code,
        userName: userDetail && concatName(userDetail?.name, userDetail?.last_name),
        ...req.body,
        oldLocationName:  req?.body?.oldLocationName =="null" ? "": req?.body?.oldLocationName ? req?.body?.oldLocationName :"",
        newLocationName:  req?.body?.newLocationName =="null" ? "": req?.body?.newLocationName ? req?.body?.newLocationName :"",
        deviceName:  req?.body?.deviceName =="null" ? "": req?.body?.deviceName ? req?.body?.deviceName :"",
        ipAddress: req?.body?.ipAddress =="null" ? "": req?.body?.ipAddress ? req?.body?.ipAddress :""
    };
    let toEmails = locationChangeNotificationEmail && locationChangeNotificationEmail?.split(",");
    // Email Data
    const emailData = {
        fromEmail: fromMail,
        toEmail: toEmails,
        template: "otp",
        subject: `Location Change Request Verification  for ${concatName(userDetail?.name, userDetail?.last_name)}`,
        substitutions: emailSubstitutions,
    };

    let param = {
        companyId: companyId,
    };
    await mailService.sendMail(param, emailData, async (err) => {
        if (err) {
            console.log(err);
        }
    });
}catch(err){
    console.log(err);
}
};
module.exports = create;
