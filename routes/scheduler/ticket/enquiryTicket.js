
const productService = require("../../../services/ProductService");
const Request = require("../../../lib/request");
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");
const ObjectName = require("../../../helpers/ObjectName");
const {SchedulerJob} = require("../../../db").models;
const OrderService = require("../../../services/OrderService");
const DateTime = require("../../../lib/dateTime");
const TicketService = require("../../../services/TicketService");

module.exports = async function (req, res) {

	try {
		let companyId = Request.GetCompanyId(req);

		let roleId = Request.getUserRole(req);

		res.send(200, { message: "Enquiry Ticket Create Started" });

		res.on("finish", async () => {
			let  id  = req.query.id;

			let timeZone = Request.getTimeZone(req);
		
			const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

			let start_date = schedularData?.start_date ?  schedularData?.start_date : new Date()
			let end_date = schedularData?.end_date ? schedularData?.end_date : new Date()

			let { startDate, endDate } = DateTime.convertDateRangeToUTC(start_date, end_date,timeZone);
			
            let params = {
                companyId: companyId,
                id: id,
                startDate:startDate,
                endDate: endDate,
                req,
				timeZone,
				roleId
            };
		
			History.create(`${schedularData?.name} Job Started`,req, ObjectName.SCHEDULER_JOB, id);
		
			  await schedulerJobCompanyService.setStatusStarted(params, (err) => {
				if (err) {
				  throw new err();
				}
			  });
			  
            await TicketService.enquiryTicket(params);
		
            History.create("Ticket: Enquiry Ticket Create Completed", req);
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