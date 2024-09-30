const { User: UserModal, Shift, Attendance, UserEmployment, SchedulerJob } = require("../../../db").models;

const User = require("../../../helpers/User");

const { getSettingValue } = require("../../../services/SettingService");

const SETTING = require("../../../helpers/Setting");

const ShiftStatus = require("../../../helpers/ShiftStatus");

// Lib
const Request = require("../../../lib/request");

const MailService = require("../../../services/MailService");

const DateTime = require("../../../lib/dateTime");
const schedulerJobCompanyService = require("../schedularEndAt");
const History = require("../../../services/HistoryService");
const ObjectName = require("../../../helpers/ObjectName");
const errors = require('restify-errors');


module.exports = async function (req, res, next) {

    let companyId = Request.GetCompanyId(req);
    let id = req.query.id;


    const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

    let toMail = schedularData?.to_email

    let defaultFromEmail = await getSettingValue(SETTING.FROM_EMAIL, companyId);

    res.send(200, { message: "Attendance Email Notification Job Started" });

    let params = { companyId: companyId, id: id };

    History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

    res.on("finish", async () => {
        try {

            await schedulerJobCompanyService.setStatusStarted(params, (err) => {
                if (err) {
                    throw new err();
                }
            });

            let AttendanceMissedUserList = new Array();

            let updatedAttendaceList = new Array();

            let userList = await UserModal.findAll({
                where: { status:User.STATUS_ACTIVE, company_id: companyId }
            });

            let shiftList = await Shift.findAll({
                where: { status: ShiftStatus.ACTIVE, company_id: companyId }
            });

            if (userList && userList.length > 0 && shiftList && shiftList.length > 0) {

                for (let i = 0; i < userList.length; i++) {

                    const { id, name } = userList[i];

                    let userEmploymentDetails = await UserEmployment.findOne({
                        where: { company_id: companyId, user_id: id }
                    })

                    if (userEmploymentDetails) {

                        const { start_date } = userEmploymentDetails;

                        if (start_date) {

                            //get time range
                            const dates = DateTime.getDatesInRange(start_date, new Date());

                            //validate date length exist or not
                            if (dates && dates.length > 0) {
                                //loop the dates
                                for (let j = 0; j < dates.length; j++) {
                                    //validate date 
                                    if (dates[j]) {

                                        let AttendanceExist = await Attendance.findOne({
                                            where: { company_id: companyId, date: dates[j] }
                                        })

                                        if (!AttendanceExist) {
                                            AttendanceMissedUserList.push({
                                                userId: id,
                                                userName: name,
                                                date: dates[j]
                                            })
                                        }

                                    }
                                }
                            }
                        }


                    }

                }

            }

            //combine user and shifts
            if (AttendanceMissedUserList && AttendanceMissedUserList.length > 0) {

                for (let i = 0; i < AttendanceMissedUserList.length; i++) {

                    const { userId, date } = AttendanceMissedUserList[i];

                    let userRecordExist = updatedAttendaceList.find((data) => data.userId == userId);

                    if (userRecordExist) {
                        let index = updatedAttendaceList.findIndex((data) => data.userId == userId);

                        updatedAttendaceList[index].dates.push(DateTime.formatDate(date, "MMM DD, YYYY"));
                    } else {
                        let newData = { ...AttendanceMissedUserList[i] };

                        let dates = new Array();

                        dates.push(DateTime.formatDate(AttendanceMissedUserList[i].date, "MMM DD, YYYY"));

                        newData.dates = dates;

                        updatedAttendaceList.push(newData);
                    }

                }
            }

            if (!toMail) {
                throw new errors.NotFoundError('To Mail Not Found');
            } else {
                toMail = toMail.split(",");
            }

            if (!defaultFromEmail) {
                throw new errors.NotFoundError('defaultFromEmail Mail Not Found');
            }

            if (toMail && toMail.length > 0 && toMail !== null) {

                let substitutions = {
                    attendanceData: updatedAttendaceList,
                }

                for (let i = 0; i < toMail.length; i++) {
                    let sentData = {
                        toEmail: toMail[i],
                        fromEmail: defaultFromEmail,
                        subject: "Attendance Reminder Email Notification",
                        template: "attendanceMissingReportEmail",
                        substitutions: substitutions
                    }

                    MailService.sendMail(params, sentData, () => {

                    });
                }

            }
        } catch (err) {
            console.log(err);
            // Set Scheduler Status Completed
            await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
                if (err) {
                    throw new err();
                }
            });
        }
    })


};
