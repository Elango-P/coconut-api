// import service
const { Op } = require("sequelize");

//Utills
const {
    md5Password,
} = require("../../lib/utils");

//systemLog
const { User: userModal, account } = require("../../db").models;
const { getOnlineSaleCompanySetting, getSettingValue } = require("../../services/SettingService");
const { USER_DEFAULT_TIME_ZONE } = require("../../helpers/Setting");
const PhoneNumber = require("../../lib/PhoneNumber");
const User = require("../../helpers/User");
const UserService = require("../../services/UserService");
const Status = require("../../helpers/Status");
const Account = require('../../helpers/Account');
const userRolePermissionService = require("../../services/UserRolePermissionService");
const AccountTypeService = require("../../services/AccountTypeService");

async function SignUp(req, res, next) {

    const data = req.body;

    let userData = {};

    let accountDetail;

    if (data && !data.name) {
        return res.send(400, { message: "First Name Is Required" });
    }


    if (data && !data.mobileNumber) {
        return res.send(400, { message: "Mobile Number Is Required" });
    }

    if (data && !data.password) {
        return res.send(400, { message: "Password Is Required" });
    }

    if (data && !data.confirmPassword) {
        return res.send(400, { message: "Confirm Password Is Required" });
    }

    if (data && data.password != data.confirmPassword) {
        return res.send(400, { message: "Password and Confirm Password Not Matched" });
    }

    let onlineConfigSetting = await getOnlineSaleCompanySetting();
    

    if (onlineConfigSetting && !onlineConfigSetting.companyId) {
        return res.send(400, { message: "Something Went Wrong" });
    }

    if (onlineConfigSetting && !onlineConfigSetting.userRole) {
        return res.send(400, { message: "Something Went Wrong" });
    }

    let userDetail = await userModal.findOne({
        where: {
            [Op.or]: [
                {
                    mobile_number1: data.mobileNumber
                }
            ],
            company_id: onlineConfigSetting.companyId,
            role: onlineConfigSetting.userRole
        }
    })

    if (userDetail) {
        return res.send(400, { message: "Account Already Exist" });
    }

    const defaultTimeZone = await getSettingValue(USER_DEFAULT_TIME_ZONE, onlineConfigSetting.companyId);
    userData.company_id = onlineConfigSetting.companyId;
    userData.name = data.name;
    userData.last_name = data.lastName;
    userData.status = User.STATUS_ACTIVE;
    userData.token = Math.floor(Date.now());
    userData.role = onlineConfigSetting.userRole;
    userData.email = data.email;
    userData.mobile_number1 = data.mobileNumber && PhoneNumber.Get(data.mobileNumber);
    userData.session_id = Math.floor(Date.now());

    userData["password"] = md5Password(data.password);

    if (defaultTimeZone) {
        userData.time_zone = defaultTimeZone;
    }

    userDetail = await userModal.create(userData);

    if (userDetail) {
         accountDetail = await account.findOne({
            where: {
                [Op.or]: [
                    {
                        mobile: data.mobileNumber
                    }
                ],
                company_id: onlineConfigSetting.companyId,
            }
        })

        if(!accountDetail){
            let params={
                category: Account.CATEGORY_CUSTOMER,
                companyId: onlineConfigSetting.companyId
              }
            let typeIds = await AccountTypeService.getAccountTypeByCategory(params)
            accountDetail = await account.create({
                name: `${data.name}`,
                mobile: data.mobileNumber,
                company_id: onlineConfigSetting.companyId,
                status: Status.ACTIVE,
                email: data.email,
                type: typeIds[0]
            })
        }
    }

    const permissionList = await userRolePermissionService.getPermissionList(
        userDetail.role,
        userDetail.company_id
    );

    res.send(200, { message: "User Singup", userDetail: userDetail, accountDetail: accountDetail, permissionList: permissionList });

    res.on("finish", async () => {
        await UserService.reindex(userDetail?.id, onlineConfigSetting.companyId)
    })
}

module.exports = SignUp;
