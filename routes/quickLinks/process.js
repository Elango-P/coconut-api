const types = require("./types");

// Utils
const utils = require("../../lib/utils");

function process(quickLink, userId) {
	const paramsList = [];

	if (quickLink.status_id) {
		paramsList.status = quickLink.status_id;
	}

	if (quickLink.group_id !== "") {
		paramsList.groupId = quickLink.group_id;
	}

	if (quickLink.type === types.PAST) {
		paramsList.etaTo = utils.getYesterdayDate();
	} else if (quickLink.type === types.TODAY) {
		paramsList.etaStart = utils.getDate();
		paramsList.etaTo = utils.getDate();
	} else if (quickLink.type === types.TODAY) {
		paramsList.etaStart = utils.getDate();
	}

	if (quickLink.show_current_user) {
		paramsList.assignedTo = userId;
	}

	if (quickLink.excluded_user) {
		paramsList.excludedUser = quickLink.excluded_user;
	}

	if (quickLink.ticket_type) {
		paramsList.ticketType = quickLink.ticket_type;
	}

	if (quickLink.project_id) {
		paramsList.projectId = quickLink.project_id;
	}

	if (quickLink.release_id) {
		paramsList.releaseId = quickLink.release_id;
	}

	const params = [];
	for (const key in paramsList) {
		if (paramsList.hasOwnProperty(key)) {
			params.push(`${key}=${paramsList[key]}`);
		}
	}

	return {
		name: quickLink.name,
		url: `${quickLink.url}${params.join("&")}`
	};
};

module.exports = process;
