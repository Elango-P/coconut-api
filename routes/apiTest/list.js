const { ApiTestList } = require("../../db").models;
const utils = require("../../lib/utils");
function list(req, res, next) {
	const { projectId } = req.params;
	const query={
		attributes: [ "id", "name", "project_id", "method", "url", "content_Type", "updated_at" ],
		where:{project_id: projectId}
		};
		
		ApiTestList.findAll(query)
		.then((apitestLists) => {
		const testLists = [];
		apitestLists.forEach((apiTest) => {
			 testLists.push({
				id: apiTest.id,
				name: apiTest.name,
				projectId: apiTest.project_id,
				method: apiTest.method,
				url: apiTest.url,
				content_Type: apiTest.content_Type,
				updatedAt: utils.ago(apiTest.updated_at),
			});
		});
		res.json({testLists});
	}).catch((err) => {
		req.log.error(err);
	});
	}
module.exports = list;