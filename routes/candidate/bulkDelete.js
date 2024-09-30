const restify = require("restify");
const { Candidate } = require("../../db").models;
const utils = require("../../lib/utils");

function bulkDelete(req, res, next) {
	const { ids } = req.body;
	if (!ids) {
		return next(validator.validationError("Invalid Candidate Id"));
	}
 
	Promise
		.all([
			Candidate.destroy({ where: { id: { $in: ids.split(",") } } })
		])
		.then(() => {
			res.json({ message: "Candidate profile deleted" });
		})
		.catch((err) => {
			req.log.error(err);
			return next(err);
		});

};

module.exports = bulkDelete;
