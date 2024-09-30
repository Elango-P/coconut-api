// import service
const {
    userRolePermissionService,
} = require("../../services/UserRolePermissionService");
const Request = require("../../lib/request");
async function list(req, res, next) {
    try {
        const companyId = Request.GetCompanyId(req)

        const roleId = Request.getUserRole(req)

        const where = {};

        where.company_id = companyId

        where.role_id = roleId

        userRolePermissionService
            .findAndCount({ where })
            .then((results) => {
                // Return null
                if (results.count === 0) {
                    return res.send(204, null);
                }

                const data = [];
                results.rows.forEach((rolePermissionData) => {
                    data.push({
                        id: rolePermissionData.id,
                        role_permission: rolePermissionData.role_permission,
                    });
                });
                res.send({
                    totalCount: results.count,
                    data,
                });
            })
            .catch((err) => {
                next(err);
            });
    } catch (err) {
        console.log(err);
    }
}

module.exports = list;
