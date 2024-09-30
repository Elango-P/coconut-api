const Request = require("../../../lib/request");
const { 
  Attendance: AttendanceModel, 
  User,
  SchedulerJob,
   Location, 
   Shift,
   PreferredLocation:PreferredLocationModel,
   UserEmployment } = require("../../../db").models;
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");
const ObjectName = require("../../../helpers/ObjectName");
const AttendanceDailyReportNotificationService = require("../../../services/AttendanceReportService");
const DateTime = require("../../../lib/dateTime");
const { getSettingList, getValueByObject } = require("../../../services/SettingService");
const { FROM_EMAIL } = require("../../../helpers/Setting");
const errors = require("restify-errors");
const Setting = require("../../../helpers/Setting");
const String = require("../../../lib/string");
const { STATUS_ACTIVE } = require("../../../helpers/Location");
const { getMediaURL } = require("../../../services/MediaService");
const { getCompanyDetailById } = require("../../../services/CompanyService");
const DataBaseService = require('../../../lib/dataBaseService');
const PreferredLocation = require("../../../helpers/PreferredLocation");
const UserEmploymentService = new DataBaseService(UserEmployment);

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

        let currentDate = DateTime.getSQlFormattedDate(DateTime.getTodayDate(defaultTimeZone));

        // Late CheckIn
        const getAttendanceData = async (storeId) => {
          let where = {};
          if (storeId) {
            where.store_id = storeId;
          } else {
            (where.store_id = null);
          }
          const getAttendanceDetails = await AttendanceModel.findAll({
            where: {
              company_id: companyId,
              date: currentDate,
              ...where,
            },
            order: [["login", "DESC"]],
            include: [
              {
                required: false,
                model: User,
                as: "user",
              },
              {
                required: false,
                model: Location,
                as: "location",
              },
              {
                required: false,
                model: Shift,
                as: "shift",
              },
            ],
          });
          let attendanceData = [];
          let userDetail;
          let locationDetails;
          let primaryLocation;
          let shiftDetails;
          for (let i = 0; i < getAttendanceDetails.length; i++) {
            const { user, location, shift, login, logout, type, check_in_media_id } = getAttendanceDetails[i];

             userDetail = await PreferredLocationModel.findOne({
              where: { user_id: user?.id, company_id: companyId, preferred_order:PreferredLocation.FIRST_ORDER },
            });

            if(userDetail){
             locationDetails = await Location.findOne({
              where: { id: userDetail?.location_id },
            });

             primaryLocation = locationDetails?.name;

             shiftDetails = await Shift.findOne({
              where: { id: userDetail?.shift_id },
            });
          }

            const primaryShiftName = shiftDetails?.name;

            let bothLocationMatched = userDetail && userDetail?.location_id === location?.id;

            attendanceData.push({
              name: String.concatName(user?.name, user?.last_name),
                media_url: check_in_media_id ? await getMediaURL(check_in_media_id, companyId) : "",
                store: location?.name ? location?.name:"",
                shiftName: shift?.name ? shift?.name:"",
                loginTime: login ? DateTime.getUserTimeZoneTime(login, defaultTimeZone) : "",
                logoutTime: logout ? DateTime.getUserTimeZoneTime(logout, defaultTimeZone) : "",
                type: type,
                user_img_url: user?.media_url ? user?.media_url :"",
                bothLocationMatched: bothLocationMatched,
                primaryLocation: primaryLocation,
                primaryShiftName: primaryShiftName,
            });
          }

          return attendanceData;
        };

        const getAttendanceList = async () => {
          let where = {};

          where.company_id = companyId;
          where.status = STATUS_ACTIVE;

          const query = {
            order: [["name", "ASC"]],
            attributes: ["name", "id", "status"],
            where,
          };
          let data = [];
          const locationData = await Location.findAndCountAll(query);
          if (locationData.rows && locationData.rows.length > 0) {
            for (let i = 0; i < locationData.rows.length; i++) {
              let locationValue = locationData.rows[i];
              let attendanceData = await getAttendanceData(locationValue?.id);
              data.push({
                locationName: locationValue?.name,
                attendanceData: attendanceData,
              });
            }
          }
          return data;
        };
        

        let Data = await getAttendanceList();
        let leaveData = await getAttendanceData(null);
        if (toMail.length > 0 && toMail !== null) {
          if (Data && Data.length > 0) {
            AttendanceDailyReportNotificationService.sendMail(
              params,
              {
                storeList: Data,
                leaveData: leaveData,
                leaveCount: leaveData && leaveData.length,
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
