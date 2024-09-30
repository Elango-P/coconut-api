// Models
const { Attendance } = require("../../db").models;

const { ABSENT } = require("../attendance/types");

// Utils
const utils = require("../../lib/utils");

const moment = require("moment");

async function noCheckOutAutoAbsentAdd(req, res, next) {
    try {

        const yesterDayDate = utils.getYesterdayDate(utils.mySQLDateFormat);

        const currentTime = utils.getTimeZoneTime(
            moment.utc(new Date(), "HH:mm"),
            "HH"
        );

        if (currentTime > 6) {

            let AttendanceList = await Attendance.findAll({
                where: { date: yesterDayDate, type: { $ne: ABSENT }, logout: null },
            });

            if (AttendanceList && AttendanceList.length > 0) {
                for (let i = 0; i < AttendanceList.length; i++) {
                    await Attendance.update({ type: ABSENT }, { where: { id: AttendanceList[i].id } })
                }
            }
        }

        return res.json(201, {
            messgae: "Absent Record Updated"
        });

    } catch (err) {
        return res.json(400, {
            message: err.message,
        });
    }
}

module.exports = noCheckOutAutoAbsentAdd;
