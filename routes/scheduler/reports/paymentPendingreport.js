const ObjectName = require("../../../helpers/ObjectName");
const MailConstants = require("../../../helpers/Setting");
const Request = require("../../../lib/request");
const { getSettingValue, getValueByObject, getSettingList } = require("../../../services/SettingService");
const History = require("../../../services/HistoryService");

const schedulerJobCompanyService = require("../schedularEndAt");
const { SchedulerJob } = require("../../../db").models;
const errors = require("restify-errors");
const mailService = require("../../../services/MailService");
const PaymentPendingReportService = require("../../../services/paymentPendingService");
// const { companyService } = require("../../services/CompanyService");
const DateTime = require("../../../lib/dateTime");
const CompanyService = require("../../../services/CompanyService");
const Setting = require("../../../helpers/Setting");


module.exports = async (req, res) => {
  const company_id = Request.GetCompanyId(req);


  let id = req.query.id;

  let currentDate = new Date();

  const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });


  let params = { companyId: company_id, id: id, currentDate: currentDate ,schedularData};

  let companyDetail = await CompanyService.getCompanyDetailById(company_id);
  let settingArray = [];
  let settingList = await getSettingList(company_id);


  for (let i = 0; i < settingList.length; i++) {
    settingArray.push(settingList[i]);
  }

  const defaultTimeZone =  Request.getTimeZone(req);

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
        let { totalAmount, paymentList} = await PaymentPendingReportService.list(Request.GetCompanyId(req));
        let substitutions = {
          data: paymentList,
          schedularName: schedularData?.name,
          companyLogo: companyDetail && companyDetail?.company_logo,
          companyName: companyDetail && companyDetail?.company_name,
          reportGeneratedAt: DateTime.getCurrentDateTimeByUserProfileTimezone(new Date(),defaultTimeZone),
          totalAmount
      }
      for (let i = 0; i < toMail.length; i++) {
          let sentData = {
              toEmail: toMail[i],
              fromEmail: fromMail,
              subject: "Payment : Pending Report",
              template: "paymentPendingReport",
              substitutions: substitutions
          }
          mailService.sendMail(params, sentData, () => { });
      }

      }
    } catch (err) {
      console.log(errors);
      // Set Scheduler Status Completed
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      console.log(err);
    }
  });

};