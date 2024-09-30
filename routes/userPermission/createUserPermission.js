const async = require("async");

// Models
const { UserPermission, Permission } = require("../../db").models;

// Create And Update User Permission
function createUserPermission(ids, userId, user_id, callback) {
	// // If ids Is Null
	if (!ids) {
		return callback(new Error("User permission is required"));
	}

	ids = ids ? ids.split(",") : ids;

	// Remove User Permission
	UserPermission
		.destroy({
			where: { permission_id: { $notIn: ids }, user_id: userId }
		})
		.then(() => {
			async.each(ids, (id, cb) => {
				Permission
					.findOne({
						attribute: ["name", "display_name"],
						where: { id }
					})
					.then((permission) => {
						if (!permission) {
							return callback();
						}

						const { name, display_name } = permission;

						UserPermission
							.findOne({
								attribute: ["id"],
								where: { permission_id: id, user_id: userId }
							})
							.then((userPermission) => {
								// User Permission Already Exists
								if (userPermission) {
									return callback();
								}

								// User Permission Data
								const userPermissionData = {
									user_id: userId,
									permission_id: id,
									name,
									display_name,
									created_by: user_id,
								};

								// User Permission Create
								return UserPermission.create(userPermissionData).then(() => cb());
							});
					});
			}, () => callback());
		});
}

module.exports = createUserPermission;
