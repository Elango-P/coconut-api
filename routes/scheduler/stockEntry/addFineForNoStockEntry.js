
const Request = require("../../../lib/request");
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");
const ObjectName = require("../../../helpers/ObjectName");
const addFineForNoStockEntry = require("../../../services/addFineForNoStockEntry");
const {SchedulerJob} = require("../../../db").models;

module.exports = async function (req, res, next) {

	try {
		let companyId = Request.GetCompanyId(req);


		res.send(200, { message: "Fine For No StockEntry Started" });

		res.on("finish", async () => {
			let  id  = req.query.id;
		
			let params = { companyId: companyId, id: id };

			const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });
		
			History.create(`${schedularData?.name} Job Started`,req, ObjectName.SCHEDULER_JOB, id);
		
			  await schedulerJobCompanyService.setStatusStarted(params, (err) => {
				if (err) {
				  throw new err();
				}
			  });
			  
                await addFineForNoStockEntry(req, res, next)
		
            History.create("Fine For No StockEntry  Completed", req);
	 //Set Scheduler Status Completed
	 await schedulerJobCompanyService.setStatusCompleted(params, err => {
		if (err) {
			throw new err();
		}
	});
	History.create(`${schedularData?.name} Job Completed`,req, ObjectName.SCHEDULER_JOB, id);

		});

	} catch (err) {
		console.log(err);
	}
}