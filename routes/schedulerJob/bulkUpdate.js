// Models
const { SchedulerJob} = require("../../db").models;

const { BAD_REQUEST, UPDATE_SUCCESS } = require("../../helpers/Response");

const ObjectName = require("../../helpers/ObjectName")
const History = require("../../services/HistoryService");
const Request = require("../../lib/request");


	
    async function bulkUpdate(req, res) {
		try {
			// Validate user
			const data = req.body;
			let company_id = Request.GetCompanyId(req);

			const { ScheduleJobIds, forceStop } = data;

			if (ScheduleJobIds && ScheduleJobIds.length == 0) {
				return res.json(400, { message: "Schedular is Required" });
			}

			for (let i = 0; i < ScheduleJobIds.length; i++) {
				
				let updateData = new Object();

				if(forceStop){
					updateData.completed_at = new Date()
				}

				await SchedulerJob.update(updateData, { where: { id: ScheduleJobIds[i], company_id } });
			}

			// API response
			res.json(UPDATE_SUCCESS, { message: "User Updated" })

		} catch (err) {
			console.log(err);
			res.json(BAD_REQUEST, { message: err.message })
		}
	}
    module.exports = bulkUpdate;

