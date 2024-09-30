const Request = require("../../../lib/request");
const {
  SchedulerJob,
  Location: LocationModel,
} = require("../../../db").models;
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");
const ObjectName = require("../../../helpers/ObjectName");
const DateTime = require("../../../lib/dateTime");
const { getSettingList, getValueByObject } = require("../../../services/SettingService");
const { FROM_EMAIL } = require("../../../helpers/Setting");
const errors = require("restify-errors");
const Setting = require("../../../helpers/Setting");
const { getCompanyDetailById } = require("../../../services/CompanyService");
const Status = require("../../../helpers/Status");
const LocationCashMismatchReportService = require("../../../services/LocationCashMismatchService");
const Currency = require("../../../lib/currency");

module.exports = async function (req, res, next) {
  const companyId = Request.GetCompanyId(req);

  let id = req.query.id;
  let settingArray = [];

  let settingList = await getSettingList(companyId);

  for (let i = 0; i < settingList.length; i++) {
    settingArray.push(settingList[i]);
  }

  let companyDetail = await getCompanyDetailById(companyId);

  const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

  const fromMail = await getValueByObject(FROM_EMAIL, settingArray);

  const defaultTimeZone =  Request.getTimeZone(req);

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

        let misMatchedLocationList = [];

        /* ✴---Get Location List and Loop---✴ */
        await LocationModel.findAll({
          where: {
            company_id: companyId,
            status: Status.ACTIVE_TEXT,
          },
          attributes: ["name", "minimum_cash_in_store", "cash_in_location"],
        }).then((locationList) => {
            if(locationList && locationList.length >0){
          for (let i = 0; i < locationList.length; i++) {
            const value = locationList[i];

            if (value?.minimum_cash_in_store !== value?.cash_in_location) {
              misMatchedLocationList.push({
                location_name: value?.name,
                minimum_cash_in_location: value?.minimum_cash_in_store
                  ? Currency.IndianFormat(value?.minimum_cash_in_store)
                  : "",
                cash_in_location: value?.cash_in_location ? Currency.IndianFormat(value?.cash_in_location) : "",
              });
            }
          }
        }
        });


        /* ✴---Send Mail Mismatched Location List---✴ */

        if (toMail.length > 0 && toMail !== null) {
          if (misMatchedLocationList && misMatchedLocationList.length > 0) {
            LocationCashMismatchReportService.sendMail(
              params,
              {
                misMatchedLocationList: misMatchedLocationList,
                companyName: companyDetail && companyDetail?.company_name,
                reportGeneratedAt: DateTime.getCurrentDateTimeByUserProfileTimezone(new Date(), defaultTimeZone),
                schedularName: schedularData && schedularData?.name,
                companyLogo: companyDetail && companyDetail?.company_logo,
              },
              (err) => {
                if (err) {
                  throw new err();
                }
              }
            );
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
