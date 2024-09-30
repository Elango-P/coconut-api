const { RolePermission } = require("../db").models;
const DataBaseService = require("../lib/dataBaseService");

const rolePermissionService = new DataBaseService(RolePermission);

const isNameExist = async (name) => {
    try {
        if (!name) {
            return null;
        }
        const isNameExist = await rolePermissionService.findOne({
            where: { name: name },
        });
        return isNameExist;
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    rolePermissionService,
    isNameExist,
};
