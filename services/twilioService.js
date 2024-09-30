const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_AUTHTOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

class twilioService {
  static async sendOtpMessage(res, phoneNumber, otp, companyName) {
    try {
      let twilioClient;
      if (accountSid) {
        twilioClient = twilio(accountSid, authToken);
      }
      if (!accountSid) {
        return { err: "Account SID is required" };
      }

      twilioClient.messages
        .create({
          body: `Your ${companyName} OTP is: ${otp}`,
          from: `${fromPhone}`,
          to: `+91${phoneNumber}`,
        })
        .then((message) =>
          console.log(`OTP sent to ${phoneNumber}: ${message.sid}`)
        )
        .catch((error) => console.error(error));
    } catch (err) {
      console.log(err);
      return { err: err.message };
    }
  }
}

module.exports = twilioService;
