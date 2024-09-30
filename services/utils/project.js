// Models
const { ProjectUser } = require("../../db").models;

module.exports = {
	/**
	 * Get project User by user id
	 *
	 * @param user_id
	 * @param project_id
	 * @param callback
	 * @returns {*}
	 */
	getProjectUser: (user_id, project_id, callback) => {
		if (!user_id) {
			return callback(null, typeof user_id !== "undefined" ? "" : user_id);
		}

		ProjectUser
			.findOne({
				attributes: ["id"],
				where: { user_id, project_id }
			})
			.then((projectUser) => {
				if (!projectUser) {
					return callback();
				}

				callback(null, projectUser.id);
			})
			.catch((err) => callback(err));
	}
};
