const utils = require("../../lib/utils");
const types = require("./types");
const statuses = require("./statuses");
const ObjectName = require("../../helpers/ObjectName");

const config = require("../../lib/config");

const { Attendance, Holiday, History } = require("../../db").models;

/**
 * Update Last Attendance
 *
 * @param attendanceDate
 * @param user_id
 * @param callback
 */
function updateLastAttendance(attendanceDate, user_id, callback) {
  Attendance.findOne({
    attributes: ["date"],
    where: { user_id, date: { $lt: attendanceDate } },
    order: [["date", "DESC"]],
  }).then((attendance) => {
    if (!attendance) {
      return callback();
    }

    const date = utils.formatDate(attendance.date, "YYYY-MM-DD");
    const yesterdayDate = utils.subtractDays(1, attendanceDate);
    if (date === yesterdayDate) {
      return callback();
    }

    Holiday.findAll({
      attributes: ["date"],
      where: { date: utils.getDateFilter("", date, yesterdayDate, true) },
    }).then((holidayDetails) => {
      const holidays = [];
      holidayDetails.forEach((holidayDetail) => {
        holidays.push(utils.formatDate(holidayDetail.date, "YYYY-MM-DD"));
      });

      const absentDays = [];
      const dates = utils.getBetweenDays(date, attendanceDate);
      dates.forEach((dateDetail) => {
        dateDetail = utils.formatDate(dateDetail, "YYYY-MM-DD");
        if (holidays.indexOf(dateDetail) < 0 && dateDetail !== date) {
          const day = utils.formatDate(dateDetail, "dddd");
          if (day !== "Saturday" && day !== "Sunday") {
            absentDays.push(dateDetail);
          }
        }
      });

      if (absentDays.length === 0) {
        return callback();
      }

      const bulkCreate = [];
      absentDays.forEach((absentDay) => {
        bulkCreate.push({
          date: absentDay,
          type: types.ABSENT,
          user_id,
          status: statuses.APPROVED,
        });
      });

      Attendance.bulkCreate(bulkCreate)
        .then(() => callback())
        .catch((err) => callback(err));
    });
  });
}

/**
 * Get Type
 *
 * @param date
 * @param callback
 */
function getType(date, callback) {
  Holiday.findOne({
    attributes: ["name"],
    where: { date },
  }).then((holiday) => {
    const day = utils.formatDate(date, "dddd");

    if (!holiday && day !== "Saturday" && day !== "Sunday") {
      return callback(null, types.WORKING_DAY);
    }

    return callback(null, types.ADDITIONAL_DAY);
  });
}

/**
 * Attendance Login
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function attendanceLogin(req, res, next) {
  const date = utils.getSQlFormattedDate();
  const user_id = req.user.id;

  Attendance.findOne({
    attributes: ["id", "login", "late_hours"],
    where: { date, user_id },
  }).then((attendance) => {
    updateLastAttendance(date, user_id, (err) => {
      if (err) {
        req.log.error(err);
        return next(err);
      }

      getType(date, (err, type) => {
        const ip_address = utils.getIPAddress(req);
        const login = utils.getSQlCurrentDateTime();

        const currentLocalTime = utils.formatLocalDate(
          login,
          "YYYY-MM-DD HH:mm:ss"
        );
        const loginTime = `${utils.getDate("YYYY-MM-DD")} ${
          req.user.login_time
        }`;

        const late_hours = utils.getTimeDiff(currentLocalTime, loginTime);

        let allowedAttendanceIps = config.allowed_attendance_ips;
     
            let status =
              type === types.ADDITIONAL_DAY
                ? statuses.PENDING
                : statuses.APPROVED;
            if (
              allowedAttendanceIps &&
              ip_address &&
              status === statuses.APPROVED
            ) {
              status =
                allowedAttendanceIps.split(",").indexOf(ip_address) < 0
                  ? statuses.PENDING
                  : statuses.APPROVED;
            }

            const attendanceData = {
              status,
              login,
              date,
              user_id,
              type,
              ip_address,
              logout: null,
            };

            if (!attendance) {
              attendanceData.late_hours = late_hours > 0 ? late_hours : 0;
              attendanceData.late_hours_status =
                late_hours > 0 ? statuses.PENDING : statuses.APPROVED;
            }

            if (attendance) {
              attendanceData.login = attendance.login || attendanceData.login;
              attendance
                .update(attendanceData)
                .then((attendanceDetail) => {
                  res.json({
                    message: "Attendance updated",
                    attendanceId: attendanceDetail.get("id"),
                  });
                  res.on("finish", async () => {
                    //create system log for product updation
                      History.create( "Attendance updated", req,
                      ObjectName.ATTENDANCE,
                      attendanceDetail.get("id"));
                  });
                })
                .catch((err) => {
                  req.log.error(err);
                  return next(err);
                });
            } else {
              Attendance.create(attendanceData)
                .then((attendanceDetail) => {
                  res.json(201, {
                    message: "Attendance added",
                    attendanceId: attendanceDetail.get("id"),
                  });
                  res.on("finish", async () => {
                    //create system log for product updation
                      History.create( "Attendance added", req,
                      ObjectName.ATTENDANCE,
                      attendanceDetail.get("id"));
                  });
                })
                .catch((err) => {
                  req.log.error(err);
                  return next(err);
                });
            }
          }
        );
      });
    });
}

module.exports = attendanceLogin;
