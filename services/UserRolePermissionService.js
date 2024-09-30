const { UserRolePermission } = require("../db").models
const DataBaseService = require("../lib/dataBaseService")

const Request = require("../lib/request");

const userRolePermissionService = new DataBaseService(
    UserRolePermission
);

const isNameExist = async (name, id) => {
    try {
        if (!name) {
            return null;
        }

        let query = {
            where: { role_permission: name, role_id: id },
            attributes: {
                exclude: ["deletedAt"]
            },
        }
        const isNameExist = await userRolePermissionService.findOne(query);
        return isNameExist;
    } catch (err) {
        console.log(err);
    }
};

const isPermissionExist = async (name, id, company_id) => {
    try {
        if (!name) {
            return null;
        }
        const isNameExist = await userRolePermissionService.findOne({
            where: { role_id: id, role_permission: name, company_id: company_id },
        });
        return isNameExist;
    } catch (err) {
        console.log(err);
    }
};

//Check User Permissions
const hasPermission = async (name, req) => {
    try {
        if (!name) {
            return null;
        }
        //Get Portal Id
        const role_id = req && req.user && req.body && req.user.id || req.user.role;
        //get company Id from request
        const company_id = Request.GetCompanyId(req);

        const isExist = await isPermissionExist(name, role_id, company_id);
        return isExist;
    } catch (err) {
        console.log(err);
    }
};

const getPermissionList = async (roleId, companyId) => {
    try {

        let permissions = new Array();

        if (roleId) {
            let permissionList = await userRolePermissionService.find({ where: { role_id: roleId, company_id: companyId },order:[["role_permission","ASC"]] });

            // Return null
            if (permissionList && permissionList.length == 0) {
                return [];
            }

            for (let i = 0; i < permissionList.length; i++) {
                permissions.push({
                    id: permissionList[i].id,
                    role_permission: permissionList[i].role_permission,
                })
            }
        }

        return permissions;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    userRolePermissionService,
    hasPermission,
    isPermissionExist,
    isNameExist,
    getPermissionList
};
