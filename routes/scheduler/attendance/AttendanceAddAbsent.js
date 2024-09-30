const { User, Attendance, Holiday, UserEmployment, SchedulerJob, Shift } = require("../../../db").models;
const { TYPE_LEAVE, TYPE_ADDITIONAL_LEAVE } = require("../../../helpers/Attendance");
const utils = require("../../../lib/utils");
const moment = require("moment");
const DateTime = require("../../../lib/dateTime");
const Request = require("../../../lib/request");
const schedulerJobCompanyService = require("../schedularEndAt");
const ObjectName = require("../../../helpers/ObjectName");
const History = require("../../../services/HistoryService");
const { getSettingList, getValueByObject } = require("../../../services/SettingService");
const Setting = require("../../../helpers/Setting");
const AttendanceService = require("../../../services/AttendanceService");
const Status = require("../../../helpers/Status");
const { Sequelize, Op } = require("sequelize");
const DataBaseService = require("../../../lib/dataBaseService");
const shiftService = new DataBaseService(Shift);
const UserEmploymentService = new DataBaseService(UserEmployment);

const dateTime = new DateTime();

const addAbsentRecord = async (id, todayDate, companyId, working_days, UserEmployment, shift_id, systemUser,settingArray, req) => {
  let attendance = await Attendance.findOne({
    attributes: ["user_id"],
    where: { user_id: id, date: todayDate, company_id: companyId },
  });

  if (!attendance) {
    const getToday = new Date(utils.getSQlFormattedDate("", dateTime.formats.mySQLDateFormat));

    const dayIndex = getToday.getDay();

    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const day = weekDays[dayIndex];

    if (working_days) {
      const workingDays = working_days.split(",");

      if (workingDays.includes(day)) {
        await Attendance.create({
          type:
            UserEmployment && UserEmployment?.leave_balance && UserEmployment?.leave_balance > 0
              ? TYPE_LEAVE
              : TYPE_ADDITIONAL_LEAVE,
          user_id: id,
          days_count: UserEmployment && UserEmployment?.leave_balance && UserEmployment?.leave_balance > 0 ? 1 : 2,
          shift_id: shift_id,
          date: new Date(),
          company_id: companyId,
        }).then(async (attendance) => {
          let channelId = await getValueByObject(Setting.ATTENDANCE_LEAVE_NOTIFICATION_CHANNEL, settingArray);
          if (channelId && channelId !== "") {
            AttendanceService.SendMessge(
              null,
              attendance?.id,
              companyId,
              attendance && attendance?.type,
              attendance?.created_at,
              null,
              channelId
            );
          }
          if (attendance) {
            await UserEmploymentService.update(
              {
                leave_balance:
                  UserEmployment && UserEmployment?.leave_balance && UserEmployment?.leave_balance > 0
                    ? UserEmployment?.leave_balance - 1
                    : 0,
              },
              {
                where: { user_id: id, company_id: companyId },
              }
            );
            History.create(
              `${attendance && attendance?.type} Added`,
              req,
              ObjectName.ATTENDANCE,
              attendance.id,
              systemUser
            );
          }
        });
      }
    }
  }
};

module.exports = async function (req, res) {
  let { id } = req.query;
  const companyId = Request.GetCompanyId(req);
  const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

  res.send(200, { message: `${schedularData?.name}  Job Started` });

  res.on("finish", async () => {
    try {
      let settingArray = [];
      let settingList = await getSettingList(Request.GetCompanyId(req));

      for (let i = 0; i < settingList.length; i++) {
        settingArray.push(settingList[i]);
      }

      History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);
      await schedulerJobCompanyService.setStatusStarted({ companyId: companyId, id: id }, (err) => {
        if (err) {
          throw new err();
        }
      });
      const defaultTimeZone = await getValueByObject(Setting.USER_DEFAULT_TIME_ZONE, settingArray);
      const todayDate = utils.getSQlFormattedDate(moment.utc(), dateTime.formats.mySQLDateFormat);
      let currentTime = DateTime.getCurrentTimeByTimeZone(defaultTimeZone);
     
      const systemUser = await getValueByObject(Setting.SYSTEM_USER, settingArray);
      let holiday = await Holiday.findOne({
        where: { date: todayDate, company_id: companyId },
      });

      if (holiday) {
        return res.json({
          message: "Today is Holiday",
        });
      }

      let users = await User.findAll({
        attributes: ["id", "role"],
        where: { status: Status.ACTIVE, company_id: companyId },
        include: [
          {
            required: false,
            model: UserEmployment,
            as: "UserEmployment",
          },
        ],
      });

      let working_days;
      let allowedShiftIds;
      let spliteShiftIds;

      if (users && users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          const { id, role, UserEmployment } = users[i].get();

          working_days = await getValueByObject(Setting.USER_WORKING_DAYS, settingArray, role, ObjectName.ROLE);
          allowedShiftIds = await getValueByObject(Setting.ROLE_ALLOWED_SHIFT, settingArray, role, ObjectName.ROLE);
          spliteShiftIds = allowedShiftIds && allowedShiftIds.split(",");
          if (spliteShiftIds && spliteShiftIds.length > 0) {
            let shiftList = await shiftService.find({
              where: {
                company_id: companyId,
                id: { [Op.in]: spliteShiftIds },
              },
              order: [["start_time", "ASC"]],
            });

            for (let i = 0; i < shiftList.length; i++) {
              const { start_time } = shiftList[i];

              //  Shift last index
              let lastIndex = shiftList && shiftList.length - 1;

              let shift_id = shiftList[lastIndex]?.id;

              let shiftStartTime = DateTime.convertGmtTimeToUserTimeZone(start_time,defaultTimeZone,"HH:mm:ss");
              const loginTime =  shiftStartTime;

              //Single allowed shift
              if (shiftList.length == 1) {

                //CurrentTime graterthen loginTime
                if (currentTime > loginTime) {
                  await addAbsentRecord(
                    id,
                    todayDate,
                    companyId,
                    working_days,
                    UserEmployment,
                    shift_id,
                    systemUser,
                    settingArray,
                    req
                  );
                }
              }

              // Multiple Allowed Shift 
              if (shiftList.length > 1) {
                if (currentTime > loginTime) {
                  if (i == lastIndex) {
                    await addAbsentRecord(
                      id,
                      todayDate,
                      companyId,
                      working_days,
                      UserEmployment,
                      shift_id,
                      systemUser,
                      settingArray,
                      req
                    );
                  }
                }
              }
            }
          }
        }
      }

      //Set Scheduler Status Completed
      await schedulerJobCompanyService.setStatusCompleted({ companyId: companyId, id: id }, (err) => {
        if (err) {
          throw new err();
        }
      });

      History.create(`${schedularData?.name} Job Completed`, req, ObjectName.SCHEDULER_JOB, id);
    } catch (err) {
      console.log(err);
    }
  });
};
