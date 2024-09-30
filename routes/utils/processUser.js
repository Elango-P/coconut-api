// Utils
const utils = require("../../lib/utils");

// Constants
const roles = require("../user/roles");

function processUser(projectUser, currentUser) {
	const user = projectUser.user.get();

	return {
		id: user.id,
		role: roles.getText(projectUser.role),
		profilePhoto: user.profile_photo ? utils.getUserMediaUrl(user.profile_photo) : "",
		name: user.name,
		currentUser: user.id === currentUser.id,
		isInactive: !projectUser.status
	};
};

module.exports = processUser;
