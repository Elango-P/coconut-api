const { BAD_REQUEST } = require("../../helpers/Response");

const { account, User } = require("../../db").models;

const { getOnlineSaleCompanySetting } = require("../../services/SettingService");

const Account = require('../../helpers/Account');

async function accountCreate(req, res, next) {

    try {
        const { mobileNumber } = req.body;

        let userDetail;

        let onlineConfigSetting = await getOnlineSaleCompanySetting();

        if(onlineConfigSetting && !onlineConfigSetting.companyId){
            return res.json(BAD_REQUEST, { message: "Something Went Wrong" });
        }

        if(onlineConfigSetting && !onlineConfigSetting.userRole){
            return res.json(BAD_REQUEST, { message: "Something Went Wrong" });
        }

        if (!mobileNumber) {
            return res.json(BAD_REQUEST, { message: "Mobile Number Is Required" });
        }

        let accountDetail = await account.findOne({
            where: { mobile: mobileNumber }
        })

        if (accountDetail) {
            return res.json(200, { acountDetail: accountDetail, accountExist: true });
        }

        accountDetail = await account.create({ mobile: mobileNumber, company_id: onlineConfigSetting.companyId, type: Account.CATEGORY_CUSTOMER })

        if (accountDetail) {
            userDetail = await User.findOne({ where: { mobile_number1: mobileNumber } })

            if(!userDetail){
                userDetail = await User.create({ mobile_number1: mobileNumber, role: onlineConfigSetting.userRole, session_id: Math.floor(Date.now()), company_id: onlineConfigSetting.companyId })
            }
        }

        res.json(200, { acountDetail: accountDetail, accountExist: false, userDetail: userDetail });

    } catch (err) {
        console.log(err);
        return res.json(BAD_REQUEST, { message: err.message });
    }

}

module.exports = accountCreate;
