const restify = require("restify");

// Models
const { ApiTestList } = require("../../db").models;

function create(req, res, next) {
    
	const data = req.body;
		const testData = {
			name: data.name,
			project_id: data.projectId,
			method: data.method,
			url: data.url,
			headers: JSON.stringify(data.header) ||null,
			body: JSON.stringify(data.body)|| null,
			params: JSON.stringify(data.params) || null,
			asserts: JSON.stringify(data.asserts)|| null,
			content_type: data.contentType,
			sort: data.sort || null,
		};
		ApiTestList
			.create(testData)
			.then(() => {
				res.json(200, {
					message: "Test created",
					});	
			}).catch((err) => {
				req.log.error(err);
				return next(err);
			});
};
module.exports = create;
