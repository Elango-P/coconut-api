const ObjectName = require("../../../helpers/ObjectName");
const MailConstants = require("../../../helpers/Setting");
const Request = require("../../../lib/request");
const LocationOpeningReportService = require("../../../services/LocationOpeningReportService");
const { getSettingValue } = require("../../../services/SettingService");
const History = require("../../../services/HistoryService");
const summaryReportEmailService = require("../../../services/storeSummaryReportService");
const schedulerJobCompanyService = require("../schedularEndAt");
const { SchedulerJob } = require("../../../db").models;
const errors = require("restify-errors");

module.exports = async (req, res) => {
  const company_id = Request.GetCompanyId(req);


  let id = req.query.id;

  let currentDate = new Date();

  let timeZone = Request.getTimeZone(req)

  const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });


  let params = { companyId: company_id, id: id,timeZone : timeZone, currentDate: currentDate ,schedularData};



  History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

  // Get  email
  const fromMail = await getSettingValue(MailConstants.FROM_EMAIL, company_id);


  res.send(200, { message: "Job started" });

  // systemLog
  res.on("finish", async () => {
    
    try {
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });

      if (!fromMail) {
        throw new errors.NotFoundError("From Mail Not Found");
      }

      let toMail = schedularData?.to_email;

      if (!toMail) {
        throw new errors.NotFoundError("To Mail Not Found");
      } else {
        toMail = toMail.split(",");
      }
      if (toMail !== null && toMail.length > 0) {
        // send email notifications
        await LocationOpeningReportService.sendMail(params, fromMail, toMail, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    } catch (err) {
      console.log(err);
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      console.log(err);
    }
  });

};