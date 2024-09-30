const utils = require("../../lib/utils");

const DateTime = require("../../lib/dateTime");

const dateTime = new DateTime();

function processPermission(result) {
	const permissionDetails = result.get();

	return {
		id: permissionDetails.id,
		name: permissionDetails.name,
		displayName: permissionDetails.display_name,
		featureName: permissionDetails.feature_name,
		createdAt: utils.formatLocalDate(permissionDetails.createdAt, dateTime.formats.frontendDateTime12HoursFormat)
	};
}

module.exports = processPermission;
