// Utils
const utils = require("../../lib/utils");

function processPage(result) {
	const pageDetails = result.get();
	const createdBy = pageDetails.createdBy;
	const updatedBy = pageDetails.updatedBy;

	const data = {
		id: pageDetails.id,
		title: pageDetails.title,
		slug: pageDetails.slug,
		createdUserName: createdBy ? createdBy.name : "",
		updatedUserName: updatedBy ? updatedBy.name : "",
		content: pageDetails.content ? utils.rawURLDecode(pageDetails.content) : "",
		status: pageDetails.status ? pageDetails.status : "",
		created_by: pageDetails.created_by,
		updated_by: pageDetails.updated_by,
		created_at: utils.formatDate(pageDetails.created_at, "DD-MM-YYYY"),
		updated_at: utils.formatDate(pageDetails.updated_at, "DD-MM-YYYY"),
		deleted_at: pageDetails.deleted_at,
	};

	return data;
}

module.exports = processPage;
