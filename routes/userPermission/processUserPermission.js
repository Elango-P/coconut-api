const utils = require("../../lib/utils");

const DateTime = require("../../lib/dateTime");

const dateTime = new DateTime();

function processUserPermission(result) {
	const userPermissionDetails = result.get();

	return {
		id: userPermissionDetails.id,
		permissionId: userPermissionDetails.permission_id,
		name: userPermissionDetails.name,
		displayName: userPermissionDetails.display_name,
		createdAt: utils.formatLocalDate(userPermissionDetails.createdAt, dateTime.formats.frontendDateTime12HoursFormat)
	};
}

module.exports = processUserPermission;
