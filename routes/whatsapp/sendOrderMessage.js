const Currency = require('../../lib/currency');
const Request = require('../../lib/request');

const { order } = require('../../db').models;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_AUTHTOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
let twilioClient
if (accountSid) {
    twilioClient = require('twilio')(accountSid, authToken);
}

const sendOrderMessage = async (req, res) => {
    try {
        let data = req.body;

        const company_id = await Request.GetCompanyId(req);

        if (!accountSid) {
            return res.json(400, { message: 'ACCOUNT_SID  is required ' });
        }

        const orderDetail = await order.findOne({ where: { id: data.orderId, company_id: company_id } });

        const message = `Your Order Total Amount is ${Currency.IndianFormat(
            orderDetail?.total_amount
        )} thank you for shopping in Zunomart have a nice day`;
        const phoneNumber = data.mobile_number.replace(/\D/g, '');
        twilioClient.messages
            .create({
                body: message,
                from: `whatsapp:${whatsappNumber}`,
                to: `whatsapp:+91${phoneNumber}`,
            })
        return res.json(200, { message: 'Shared' });
    } catch (error) {
        console.log(error);
        return res.json(500, { message: error.message });
    }
};
module.exports = sendOrderMessage;