const Number = require("../lib/Number");
const { generateOTP } = require("../lib/utils");

const { Otp } = require("../db").models;

class OTPService {

    static async create(params) {

        let otpData = {
            object_name: params?.objectName,
            object_id: params?.objectId,
            company_id: params?.companyId,
            code: generateOTP(6),
            type: params?.type
        }

        let response = await Otp.create(otpData);

        return response

    }


    static async verifyOtp(params, res) {

        let getOtpDetail = await Otp.findOne({
            where: {
                object_id: params?.objectId,
                object_name: params?.objectName,
                type: params?.type,
                company_id: params?.companyId,
                used_at: null
            },
            order: [["createdAt", "DESC"]]
        })

        if (getOtpDetail) {
            if (getOtpDetail && getOtpDetail?.expired_at == null) {
                if (Number.Get(getOtpDetail?.code) == Number.Get(params?.verificationCode)) {
                    getOtpDetail.update({
                        expired_at: new Date(),
                        used_at: new Date()
                    })
                    res.json(200, { message: "OTP Verified" })
                } else {
                    res.json(400, { message: "Enter Valid Otp" })
                }

            } else {
                res.json(400, { message: "Your Otp Expired" })
            }
        }

    }
}
module.exports = OTPService