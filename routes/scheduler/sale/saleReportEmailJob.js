const ObjectName = require("../../../helpers/ObjectName");
const { BAD_REQUEST } = require("../../../helpers/Response");
const MailConstants = require("../../../helpers/Setting");
const DateTime = require("../../../lib/dateTime");
const Request = require("../../../lib/request");
const saleEmailService = require("../../../services/SaleReportMailService");
const { getSettingValue } = require("../../../services/SettingService");
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");
const { SchedulerJob } = require("../../../db").models;
const errors = require("restify-errors");

module.exports = async (req, res) => {
  const company_id = Request.GetCompanyId(req);

  let id = req.query.id;

  let currentDate = DateTime.getSQlFormattedDate(new Date());
  let params = { companyId: company_id, id: id, currentDate: currentDate };

  const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });

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
        //send email notifications
        await saleEmailService.sendMail(params, fromMail, toMail, company_id, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    } catch (err) {
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      console.log(err);
    }
  });
};
