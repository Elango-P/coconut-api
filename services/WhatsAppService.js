
const config = require("../lib/config");

const { default: axios } = require('axios');

const { getSettingValue } = require('../services/SettingService');

const Setting = require("../helpers/Setting");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_AUTHTOKEN;
let twilioClient
if (accountSid) {
    twilioClient = require('twilio')(accountSid, authToken);
}
const fromPhone = process.env.TWILIO_WHATSAPP_NUMBER;
class WhatsAppService {

    static META_BASE_URL = "https://graph.facebook.com";


    static async postGraphApi(apiUrl, body, companyId) {
        try {
            let accessToken = await getSettingValue(Setting.WHATSAPP_ACCESS_TOKEN, companyId);

            let response = await axios.post(
                apiUrl,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            return response;
        } catch (err) {
            console.log(err);
        }
    }

    static async sendAttendanceNotification(message, companyId) {
        try {
            let apiUrl = `${this.META_BASE_URL}/${config.whatsappApiVersion}/${config.whatsappPhoneNumberId}/messages`

            let mobileNumber = await getSettingValue(Setting.LOGIN_WHATSAPP_NOTIFICATION_NUMBER, companyId);

            if (!mobileNumber) {
                throw { message: "Notification Mobile Number Is Required" };
            }

            let body = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": mobileNumber,
                "type": "text",
                "text": {
                    "preview_url": false,
                    "body": message
                }
            };

            let response = await this.postGraphApi(apiUrl, body, companyId)

            return response;

        } catch (err) {
            console.log(err);
        }
    }

    static async sendAttendanceImage(imageUrl, companyId) {
        try {
            let apiUrl = `${this.META_BASE_URL}/${config.whatsappApiVersion}/${config.whatsappPhoneNumberId}/messages`

            let mobileNumber = await getSettingValue(Setting.LOGIN_WHATSAPP_NOTIFICATION_NUMBER, companyId);

            if (!mobileNumber) {
                throw { message: "Notification Mobile Number Is Required" };
            }

            let body = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": mobileNumber,
                "type": "image",
                "image": {
                    "link": imageUrl,
                }
            };

            let response = await this.postGraphApi(apiUrl, body, companyId)

            return response;
        } catch (err) {
            console.log(err);
        }
    }
    static async sendMessage(messageBody,mobileNumber) {
        try {
            twilioClient.messages
              .create({
                  body: messageBody,
                  from: `whatsapp:${fromPhone}`,
                  to: `whatsapp:+91${mobileNumber}`,
              }).then(message =>  console.log(message))
              .catch(error => console.error(error));
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = WhatsAppService;