// import service
const { userRolePermissionService } = require("../../services/UserRolePermissionService");

async function deletePermission (req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);

        // Validate id
        if (!id) {
            return res
                .send(400, { message: "Role Permission Id is required" });
        }

        try {
            //  Get Permission Details
            const rolePermissionDetails =
                await userRolePermissionService.findOne({
                    attributes: ["id"],
                    where: { id },
                });

            // Permission Not Found
            if (!rolePermissionDetails) {
                return res
                    .send(400, { message: "Role Permission not found" });
            }

            // Delete The Permission Details
            await rolePermissionDetails.destroy();

            // Success
            res.send({
                message: "Permission deleted",
            });
        } catch (err) {
            (err) => res.send(400, { message: err.message });
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = deletePermission;