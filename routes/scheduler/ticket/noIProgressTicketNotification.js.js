const { SchedulerJob, Attendance: AttendanceModel } = require('../../../db').models;

const Status = require('../../../helpers/Status');

// Lib
const Request = require('../../../lib/request');

const schedulerJobCompanyService = require('../schedularEndAt');
const History = require('../../../services/HistoryService');
const ObjectName = require('../../../helpers/ObjectName');
const DataBaseService = require('../../../lib/dataBaseService');
const SlackService = require('../../../services/SlackService');
const Attendance = require("../../../helpers/Attendance");
const { Op } = require("sequelize");
const DateTime = require("../../../lib/dateTime");
const AttendanceTypeService = require("../../../services/AttendanceTypeService");
const SchedulerJobService = new DataBaseService(SchedulerJob);
const { User, TicketIndex, Slack } = require('../../../db').models;

module.exports = async function (req, res) {
  let params = { companyId: Request.GetCompanyId(req), id: Request.GetId(req) };

  const schedularData = await SchedulerJobService.findOne({
    where: { id: Request.GetId(req), company_id: Request.GetCompanyId(req) },
  });

  res.send(200, { message: `Job Started` });

  res.on('finish', async () => {
    try {
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      const users = await User.findAll({
        where: { company_id: params.companyId },
        attributes: ['id', 'name'],
      });
      let leaveIds = await AttendanceTypeService.getAttendanceTypeId({is_leave:true, company_id: params?.companyId})
      const inProgressTicket = await Promise.all(
        users.map(async (user) => {
          const list = await TicketIndex.findAll({
            where: { assignee_id: user.id, status_group_id: Status.GROUP_INPROGRESS },
          });
          if (list.length === 0) {
            return { user: user.id };
          } else {
            return null;
          }
        })
      );
      const filteredUserList = inProgressTicket.filter(Boolean);
      let slack_id = [];
      for (let i = 0; i < filteredUserList.length; i++) {
        let attendanceData = await AttendanceModel.findOne({
          where: {
            user_id: filteredUserList[i].user,
            company_id: params.companyId,
            date: DateTime.getSQlFormattedDate(new Date()),
            type: { [Op.notIn]: leaveIds },
            login: { [Op.ne]: null },
            logout: { [Op.eq]: null },
          },
        });
        if(attendanceData){
          let slack = await Slack.findAll({ where: { object_id: attendanceData?.user_id }, attributes: ["slack_id"] });

          slack.forEach((slack) => {
            slack_id.push({
              id: slack.slack_id,
            });
          });
        slack_id.forEach((slack) => {
          SlackService.sendMessageToUser(params.companyId, slack.id, "No in-progress ticket");
        });
      }
        await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
          if (err) {
            throw new err();
          }
        });
        History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, Request.GetId(req));
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
  });
};
