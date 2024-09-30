const Request = require("../../../lib/request");
const { SchedulerJob } = require("../../../db").models;
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");
const ObjectName = require("../../../helpers/ObjectName");
const AttendanceDailyReportNotificationService = require("../../../services/AttendanceReportService");
const DateTime = require("../../../lib/dateTime");
const { getSettingList, getValueByObject } = require("../../../services/SettingService");
const { FROM_EMAIL } = require("../../../helpers/Setting");
const errors = require("restify-errors");
const { getCompanyDetailById } = require("../../../services/CompanyService");
const OrderReportService = require("../../../services/OrderReportService");
const mailService = require("../../../services/MailService");
const StoreProduct = require("../../../helpers/StoreProduct");
const { REPORT_TYPE_LOCATION_WISE } = require("../../../helpers/OrderProduct");

module.exports = async function (req, res, next) {
  const companyId = Request.GetCompanyId(req);

  // send response

  let id = req.query.id;
  let settingArray = [];

  let settingList = await getSettingList(companyId);

  for (let i = 0; i < settingList.length; i++) {
    settingArray.push(settingList[i]);
  }

  let companyDetail = await getCompanyDetailById(companyId);

  const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

  const fromMail = await getValueByObject(FROM_EMAIL, settingArray);

  const defaultTimeZone = Request.getTimeZone(req);

  let toMail = schedularData?.to_email;

  const params = {
    companyId: companyId,
    id: id,
    fromMail,
    toMail,
  };

  res.send(200, { message: `${schedularData?.name}  Job Started` });

  History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

  res.on("finish", async () => {
    await schedulerJobCompanyService.setStatusStarted(params, (err) => {
      if (err) {
        throw new err();
      }
    });
    try {
      if (companyId) {
        if (!fromMail) {
          throw new errors.NotFoundError("From Mail Not Found");
        }

        if (!schedularData?.to_email) {
          throw new errors.NotFoundError("To Mail Not Found");
        } else {
          toMail = toMail.split(",");
        }
        let { startDate, endDate } = DateTime.getCustomDateTime(schedularData?.date_type,defaultTimeZone)
       let param ={
            companyId: companyId,
            timeZone: defaultTimeZone,
            pagination: false,
            startDate: startDate,
            endDate: endDate,
            type: REPORT_TYPE_LOCATION_WISE,
            ...(schedularData?.object_status ? {status: schedularData?.object_status } :{})
        }

        let { data } =  await OrderReportService.getReport(param, res)

        if (toMail.length > 0 && toMail !== null) {
          if (data && data.length > 0) {
   
            const emailSubstitutions = {
                orderReportList: data,
                companyName: companyDetail && companyDetail?.company_name,
                reportGeneratedAt: DateTime.getCurrentDateTimeByUserProfileTimezone(new Date(), defaultTimeZone),
                schedularName: schedularData && schedularData?.name,
                companyLogo: companyDetail && companyDetail?.company_logo,
              };
        
              // Email Data
              const emailData = {
                fromEmail: fromMail,
                toEmail: toMail,
                template: 'orderReport',
                subject: `Order Report - ${emailSubstitutions.reportGeneratedAt}`,
                substitutions: emailSubstitutions,
              };
        
              // Sent Email
              mailService.sendMail(params, emailData, async (err) => {
                if (err) {
                  History.create(StoreProduct.EMAIL_SENT_FAILED);
                  console.log(err);
                }
              });

          }
        } else {
          await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
            if (err) {
              throw new err();
            }
          });
        }
      }
    } catch (err) {
      console.log(err);
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
    }
  });
};
