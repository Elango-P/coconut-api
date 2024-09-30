const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_AUTHTOKEN;


let twilioClient;
if (accountSid) {
  twilioClient = twilio(accountSid, authToken);
}


const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

module.exports = {
  generateOTP,

};