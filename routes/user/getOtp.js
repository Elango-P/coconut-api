const errors = require("restify-errors");
const { User: UserModel } = require("../../db").models;
const { getCompanyDetailById } = require("../../services/CompanyService");
const User = require("../../helpers/User");
const { generateOTP } = require("../../lib/Otp");
const twilioService = require("../../services/twilioService");
const Response = require("../../helpers/Response");

async function getOtp(req, res, next) {
  try {
    const data = req.body;
   

    const phone_number = data.phone_number;
    if (!phone_number) {
      return next(new errors.BadRequestError("Phone Number is required"));
    }

    UserModel.findOne({
      attributes: [
        "id",
        "name",
        "password",
        "mobile",
        "mobile_number1",
        "session_id",
        "role",
        "last_name",
        "company_id",
        "ip_address",
        "email",
        "company_id",
        "time_zone",
      ],
      where: { mobile_number1: data.phone_number, status: User.STATUS_ACTIVE },
    }).then(async (user) => {
     
      if (!user) {
        return res.json(Response.BAD_REQUEST, {
          message: "Invalid Username or Password",
        });
      }
      if (data.otpVerification) {
        let companyDetail = await getCompanyDetailById(user.company_id);

        const phoneNumber = data.phone_number;

        const otp = generateOTP();

        await UserModel.update(
          { otp_createdAt: new Date(), otp: otp },
          { where: { id: user.id } }
        );

        let response = await twilioService.sendOtpMessage(
          res,
          phoneNumber,
          otp,
          companyDetail.company_name
        );
        if (response && response.err) {
          return res.json(Response.BAD_REQUEST, { message: response.err });
        } else {
          return res.json(Response.OK, { message: "OTP sent" });
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = getOtp;
