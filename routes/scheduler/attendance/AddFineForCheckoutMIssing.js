const Request = require("../../../lib/request");
const { SchedulerJob } = require("../../../db").models;
const schedulerJobCompanyService = require("../schedularEndAt");
const History = require("../../../services/HistoryService");
const ObjectName = require("../../../helpers/ObjectName");
const Attendance = require("../../../services/AttendanceService");
const DateTime = require("../../../lib/dateTime");

module.exports = async function (req, res) {
    try {
        const companyId = Request.GetCompanyId(req);

        res.json(200, { message: "Attendance Check-Out Missing Fine Add Started" });

        res.on("finish", async () => {

             let  id  = req.query.id;

              let params = { companyId: companyId, id: id };


      const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

			let start_date = schedularData?.start_date ?  schedularData?.start_date : new Date()
			let end_date = schedularData?.end_date ? schedularData?.end_date : new Date()

     await History.create(`${schedularData?.name} Job Started`,req, ObjectName.SCHEDULER_JOB, id);
            await schedulerJobCompanyService.setStatusStarted(params, err => {
                if (err) {
                    throw new err();
                }
            });

            let fineParams={
                company_id: companyId,
                startDate: DateTime.toGetISOStringWithDayStartTime(start_date) ,
                endDate: DateTime.toGetISOStringWithDayEndTime(end_date) 
            }

            await Attendance.AddFineForCheckoutMissing(fineParams)

      
            await schedulerJobCompanyService.setStatusCompleted(params, err => {
                if (err) {
                    throw new err();
                }
            });
            History.create(`${schedularData?.name} Job Completed`,req, ObjectName.SCHEDULER_JOB, id);

        })

    } catch (err) {
        console.log(err);
    }
};