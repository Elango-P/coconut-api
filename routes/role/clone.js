/**
 * Module dependencies
 */
const ObjectName = require("../../helpers/ObjectName");
const { BAD_REQUEST, UPDATE_SUCCESS } = require("../../helpers/Response");
const DataBaseService = require("../../lib/dataBaseService");
const Request = require("../../lib/request");
const { UserRole, UserRolePermission, Setting } = require("../../db").models;
const settingService = new DataBaseService(Setting);


//systemLog
const History = require("../../services/HistoryService");
const UserRoleService = require("../../services/UserRoleService");

async function clone(req, res, next) {
    const { id } = req.params;
    let data = req.body;
    let companyId = Request.GetCompanyId(req)
    try {

        const isRoleNameAlreadyExist = await UserRoleService.isNameExist(data?.roleName.trim(), companyId)

        if(isRoleNameAlreadyExist){
            return res.json(400,{message:"Role Name Already Exist"})
        }

        const userRoleDetail = await UserRole.findOne({
            where: { id: id, company_id: companyId },
        });

        if (!userRoleDetail) {
            return res.json(400, { message: "User Role Not Found" })
        }

        const clonedUserRole = { ...userRoleDetail.toJSON(), id: null, role_name: data?.roleName };

        await UserRole.create(clonedUserRole).then(async (newRoleValue) => {

            let UserRolePermissionData = await UserRolePermission.findAll({
                where: {
                    role_id: id,
                    company_id: companyId
                }
            });

            if (UserRolePermissionData && UserRolePermissionData.length > 0) {
                for (let i = 0; i < UserRolePermissionData.length; i++) {
                    const { role_permission } = UserRolePermissionData[i];
                    await UserRolePermission.create({ role_permission: role_permission, role_id: newRoleValue?.id, company_id: companyId });
                }
            }


            let settingValue = await settingService.find({
                where: {
                    object_name: ObjectName.ROLE,
                    object_id: id,
                    company_id: companyId
                }
            });

            if (settingValue && settingValue.length > 0) {
                for (let i = 0; i < settingValue.length; i++) {
                    const { name, value, object_name } = settingValue[i];
                    await Setting.create({
                        object_id: newRoleValue?.id,
                        name: name,
                        value: value,
                        company_id: companyId,
                        object_name: object_name
                    })
                }
            }

            res.json(UPDATE_SUCCESS, { message: "User Role Cloned" })
            res.on("finish", async () => {
                History.create(`User Role Cloned`, req, ObjectName.ROLE, newRoleValue?.id);
            });
        })

    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }
};

module.exports = clone;
