const ObjectName = require("../../../helpers/ObjectName");
const Request = require("../../../lib/request");
const History = require("../../../services/HistoryService");
const RecurringTaskService = require("../../../services/RecurringTaskService");
const schedulerJobCompanyService = require("../schedularEndAt");
const { getSettingValue } = require("../../../services/SettingService");
const Setting = require("../../../helpers/Setting");
const { SchedulerJob } = require("../../../db").models;

module.exports = async (req, res) => {
  try {
    const company_id = Request.GetCompanyId(req);
    let systemUser = await getSettingValue(Setting.SYSTEM_USER, company_id);


    let id = req.query.id;

    let currentDate = new Date();

    const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });

    let params = { companyId: company_id, id: id, currentDate: currentDate, schedularData };

    History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id,systemUser);

    res.send(200, { message: "Job started" });

    // systemLog
    res.on("finish", async () => {
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });

      await RecurringTaskService.createTask(req, params);
      History.create("Recurring Task : Recurring Task Completed", req, ObjectName.SCHEDULER_JOB, id,systemUser);
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      History.create(`${schedularData?.name} Job Completed`, req, ObjectName.SCHEDULER_JOB, id,systemUser);
    });
  } catch (err) {
    console.log(err);
  }
};
