const { Attendance, Shift, SchedulerJob } = require('../../../db').models;
const { Op } = require('sequelize');
const ObjectName = require('../../../helpers/ObjectName');
const DateTime = require("../../../lib/dateTime");
const Request = require('../../../lib/request');
const History = require('../../../services/HistoryService');
const schedulerJobCompanyService = require('../schedularEndAt');
const { TYPE_LEAVE, TYPE_ADDITIONAL_LEAVE, TYPE_ABSENT } = require('../../../helpers/Attendance');

module.exports = async function (req, res) {
  try {
    let company_id = Request.GetCompanyId(req);

    res.send(200, { message: 'Job started' });
    res.on('finish', async () => {
      let id = req.query.id;

      let params = { companyId: company_id, id: id };

      const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });

      History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      // Getting sale details
      let attendanceDetails = await Attendance.findAndCountAll({
        where: {
          company_id: company_id,
          type: { [Op.notIn]: [TYPE_LEAVE, TYPE_ADDITIONAL_LEAVE, TYPE_ABSENT] }
        },
      });

      for (let data of attendanceDetails.rows) {
        let attendanceData = { ...data.get() };

        const shiftData = await Shift.findOne({
          where: { company_id: company_id, id: attendanceData && attendanceData.shift_id },
        });
        if (shiftData) {
          let { start_time, end_time } = shiftData;


          let updateData = {};
          let late_hours = start_time < DateTime.formateTime(attendanceData.login) ? DateTime.getTimeDifference(start_time, DateTime.formateTime(attendanceData.login)) : "00:00";

          const start_additional_hours = DateTime.formateTime(attendanceData.login) < start_time
            ? DateTime.getTimeDifference(DateTime.formateTime(attendanceData.login), start_time)
            : "00:00";

          const end_additional_hours = end_time < DateTime.formateTime(attendanceData.logout)
            ? DateTime.getTimeDifference(end_time, DateTime.formateTime(attendanceData.logout))
            : "00:00";

          const additional_hours = DateTime.sumTimes(start_additional_hours, end_additional_hours);

          if (late_hours) { updateData.late_hours = DateTime.convertHoursToMinutes(late_hours) }
          if (additional_hours) { updateData.additional_hours = DateTime.convertHoursToMinutes(additional_hours) }
          await Attendance.update(updateData, {
            where: { id: attendanceData.id, company_id: attendanceData.company_id },
          });
        }
      }

      //Set Scheduler Status Completed
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      History.create(`${schedularData?.name} Job Completed`, req, ObjectName.SCHEDULER_JOB, id);
    });
  } catch (err) {
    console.log(err);
  }
};
