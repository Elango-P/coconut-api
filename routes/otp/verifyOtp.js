const ObjectName = require('../../helpers/ObjectName');
const Request = require('../../lib/request');
const OTPService = require('../../services/OTPService');
const Otp = require("../../helpers/Otp.");
const Number = require("../../lib/Number");
const { UserDeviceInfo } = require('../../db').models;


const verifyOtp = async (req, res, next) => {
  let companyId = Request.GetCompanyId(req);
  let userId = Request.getUserId(req);
  let deviceName
  if (Number.isNotNull(req && req.body && req.body?.deviceName)) {
    deviceName = req && req.body && req.body?.deviceName;
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
    verificationCode: req?.body?.verificationCode
  };

  await OTPService.verifyOtp(params,res);

 
};
module.exports = verifyOtp;
