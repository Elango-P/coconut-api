// import service
const { userRoleService } = require("../../services/UserRoleService");

async function deleteRole(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);

        // Validate id
        if (!id) {
            return res.json(400, { message: "Role Id is required" });
        }

        try {
            //  Get Role Details
            const roleDetails = await userRoleService.findOne({
                attributes: ["id"],
                where: { id },
            });

            // Role Not Found
            if (!roleDetails) {
                return res.json(400, { message: "Role not found" });
            }

            // Delete The Role Details
            await roleDetails.destroy();

            // Success
            res.send({
                message: "Role deleted",
            });
        } catch (err) {
            (err) => res.json(400, { message: err.message });
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports = deleteRole;