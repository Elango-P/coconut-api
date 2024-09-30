const { SchedulerJob } = require("../../../db").models;
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");
const ObjectName = require("../../../helpers/ObjectName");
const Request = require("../../../lib/request");
const AttendanceService = require("../../../services/AttendanceService");
const Response = require("../../../helpers/Response");

module.exports = async function (req, res, next) {
  const companyId = Request.GetCompanyId(req);
  try {
    res.send(Response.OK, { message: "Job started" });

    res.on("finish", async () => {
      let id = req.query.id;

      let params = { companyId: companyId, id: id };

      const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });
      History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

      //Set Scheduler Status started
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      
      let param={
        startDate: schedularData?.start_date,
        endDate: schedularData?.end_date,
        timeZone:Request.getTimeZone(req)
      }

      await AttendanceService.addMissingAbsentRecord(param,companyId);

      //Set Scheduler Status Completed
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });

      History.create(`${schedularData?.name} Job Completed`, req, ObjectName.SCHEDULER_JOB, id);
    });
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, { message: err.message });
  }
};
