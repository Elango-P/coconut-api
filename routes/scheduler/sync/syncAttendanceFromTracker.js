// Lib
const Request = require("../../../lib/request");

const MySqlDB = require("../../../lib/connectMySqlDB");

// Model
const { Attendance, User,SchedulerJob } = require("../../../db").models;

const Type = require("../../../helpers/trackerAttendanceTypes");
const schedulerJobCompanyService = require("../schedularEndAt");
const History = require("../../../services/HistoryService");
const ObjectName = require("../../../helpers/ObjectName");

module.exports = async function (req, res) {
    try {
        const companyId = Request.GetCompanyId(req);

        res.json(200, { message: "Attendance Record Sync Started" });

        res.on("finish", async () => {

             let  id  = req.query.id;

    let params = { companyId: companyId, id: id };


      const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

      History.create(`${schedularData?.name} Job Started`,req, ObjectName.SCHEDULER_JOB, id);
            await schedulerJobCompanyService.setStatusStarted(params, err => {
                if (err) {
                    throw new err();
                }
            });
            let dbConnection = MySqlDB.Connect();

            if (dbConnection) {

                let attendanceTypeList = await dbConnection.connection.query('SELECT * FROM attendance');

                if (attendanceTypeList && attendanceTypeList.length > 0) {

                    let attendanceList = attendanceTypeList[0];

                    if (attendanceList && attendanceList.length > 0) {

                        for (let i = 0; i < attendanceList.length; i++) {
                            const {
                                id,
                                user_id,
                                date,
                                login,
                                logout,
                                status,
                                worked_hours,
                                not_worked_hours,
                                productive_hours,
                                non_productive_hours,
                                late_hours,
                                additional_hours,
                                late_hours_status,
                                notes,
                                ip_address,
                                type,
                                is_leave,
                                leave_status,
                                productive_cost,
                                non_productive_cost,
                                activity_status,
                                lop_hours,
                            } = attendanceList[i];

                            let attendanceExist = await Attendance.findOne({
                                where: { tracker_attendance_id: id }
                            })

                            if (user_id) {

                                let trackerUserExist = await User.findOne({
                                    where: { tracker_user_id: user_id, company_id: companyId }
                                })

                                if (!attendanceExist && trackerUserExist) {
                                    let createData = {
                                        tracker_attendance_id: id,
                                        user_id : trackerUserExist.id,
                                        date,
                                        login,
                                        logout,
                                        status,
                                        worked_hours,
                                        not_worked_hours,
                                        productive_hours,
                                        non_productive_hours,
                                        late_hours,
                                        additional_hours,
                                        late_hours_status,
                                        notes,
                                        ip_address,
                                        type : Type.getText(type),
                                        is_leave,
                                        leave_status,
                                        productive_cost,
                                        non_productive_cost,
                                        activity_status,
                                        lop_hours,
                                        company_id: companyId
                                    }

                                    await Attendance.create(createData);
                                }

                            }
                        }

                    }


                }

            }
            await schedulerJobCompanyService.setStatusCompleted(params, err => {
                if (err) {
                    throw new err();
                }
            });
            History.create(`${schedularData?.name} Job Completed`,req, ObjectName.SCHEDULER_JOB, id);

        })

    } catch (err) {
        console.log(err);
    }
};