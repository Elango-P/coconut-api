const restify = require("restify");
const Permission = require("../../helpers/Permission");
const Request = require("../../lib/request");

// Models
const { SchedulerJob } = require("../../db").models;

async function updateLastExecutedAt(req, res, next) {

	const id = req.params.id;
	let company_id = Request.GetCompanyId(req);
    
	SchedulerJob.update({
		completed_at : new Date()
    },
   { where: { id, company_id } })
   .then(() => {
	res.json({
		message: "Scheduler Job updated",
	});
})
.catch((err) => {
	req.log.error(err);
	console.log(err);
	return next(err);
});
}

module.exports = updateLastExecutedAt;
