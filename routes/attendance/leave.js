const errors = require("restify-errors");
const utils = require("../../lib/utils");
const types = require("./types");
const statuses = require("./statuses");
const async = require("async");
const sendApplyLeaveEmail = require("./sendApplyLeaveEmail");
const ObjectName = require("../../helpers/ObjectName");

const { Attendance, Holiday, User, History } = require("../../db").models;

function leave(req, res, next) {
  const data = req.body;

  const notes = data.notes;
  if (!notes) {
    return next(new errors.BadRequestError("Reason is required"));
  }

  let date = data.date;
  if (!date) {
    return next(new errors.BadRequestError("Date is required"));
  }

  date = utils.customDate(date, "DD-MM-YYYY", "YYYY-MM-DD");

  const user_id = req.user.id;

  Promise.all([
    Holiday.findOne({
      attributes: ["name"],
      where: { date },
    }),
    Attendance.findOne({
      attributes: ["id"],
      where: { date, user_id },
    }),
    User.findOne({
      attributes: ["name", "last_name", "email"],
      where: { id: user_id },
    }),
  ]).then(([holiday, attendance, user]) => {
    if (holiday) {
      const formattedDate = utils.formatDate(date, "MMM DD, Y");
      return next(
        new errors.BadRequestError(`${formattedDate} is ${holiday.get().name}`)
      );
    }

    user.message = data.notes;
    user.date = data.date;

    async.waterfall([(cb) => sendApplyLeaveEmail(user, cb)], (err) => {
      if (err) {
        req.log.error(err);
        return next(err);
      }

      const ip_address = utils.getIPAddress(req);
      const status = statuses.PENDING;
      if (attendance) {
        return attendance
          .update({
            type: types.LEAVE,
            notes,
            ip_address,
            status,
          })
          .then((attendanceDetail) => {
            res.json(201, {
              message: "Leave applied",
              attendanceId: attendanceDetail.get("id"),
            });
            res.on("finish", async () => {
              //create system log for product updation
                History.create("Leave applied", req,
                ObjectName.ATTENDANCE,
                attendanceDetail.get("id"));
            });
          })
          .catch((err) => {
            req.log.error(err);
            return next(err);
          });
      }
      Attendance.create({
        date,
        notes,
        user_id,
        ip_address,
        status,
        type: types.LEAVE,
      })
        .then((attendanceDetail) => {
          res.json(201, {
            message: "Leave applied",
            attendanceId: attendanceDetail.get("id"),
          });
          res.on("finish", async () => {
            //create system log for product updation
              History.create( "Leave applied", req,
              ObjectName.ATTENDANCE,
              attendanceDetail.get("id"));
          });
        })
        .catch((err) => {
          req.log.error(err);
          return next(err);
        });
    });
  });
}

module.exports = leave;
