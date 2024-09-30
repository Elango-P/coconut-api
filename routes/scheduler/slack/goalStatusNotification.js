const async = require('async');
const { Op } = require('sequelize');

// Models
const { User, Attendance, Activity, Ticket, Project, SchedulerJob } = require('../../../db').models;

// Utils
const utils = require('../../../lib/utils');

// Slack Notification
const ticketSlackNotifications = require('../../../services/notifications/ticket');

const DateTime = require('../../../lib/dateTime');
const schedulerJobCompanyService = require('../schedularEndAt');
const History = require('../../../services/HistoryService');
const ObjectName = require('../../../helpers/ObjectName');
const Response = require('../../../helpers/Response');
const Request = require('../../../lib/request');

const dateTime = new DateTime();

function goalStatusNotification(req, res, next) {
  const todayDate = utils.getSQlFormattedDate();
  const currentDateTime = utils.getSQlFormattedDate('', dateTime.formats.mySQLDateTimeFormat);
  const startOfDay = utils.getStartOfDay();
  const endOfDay = utils.getEndOfDay();
  res.send(Response.OK, { message: 'Job started' });
  res.on('finish', async () => {
    let id  = req.query.id;

    let companyId = Request.GetCompanyId(req);

    let params = { companyId: companyId, id: id };

    const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });
    History.create(`${schedularData?.name} Job Started`,req, ObjectName.SCHEDULER_JOB, id);
    await schedulerJobCompanyService.setStatusStarted(params, (err) => {
      if (err) {
        throw new err();
      }
    });
    
    Attendance.findAll({
      attributes: ['login', 'user_id'],
      include: [
        {
          required: true,
          model: User,
          as: 'user',
          attributes: ['name', 'slack_id', 'manager', 'role', 'id', 'minimum_reported_tickets_story_points'],
          where: { minimum_reported_tickets_story_points: { [Op.ne]: null } },
        },
      ],
      where: { date: todayDate, login: { [Op.ne]: null }, logout: null },
    }).then((loggedInUsers) => {
      if (loggedInUsers.length > 0) {
        async.eachSeries(loggedInUsers, (loggedInUser, cb) => {
          const { user_id, user } = loggedInUser.get();
          const { slack_id, name, manager, role, id, minimum_reported_tickets_story_points } = user.get();
          Ticket.sum('story_points', {
            where: {
              reported_by: id,
              created_at: { $gte: startOfDay, $lt: endOfDay },
            },
          }).then((totalReportedTicketsStoryPoints) => {
            const percentage = (totalReportedTicketsStoryPoints / minimum_reported_tickets_story_points) * 100;
            ticketSlackNotifications.sendGoalStatusNotification(
              totalReportedTicketsStoryPoints,
              minimum_reported_tickets_story_points,
              manager,
              slack_id,
              percentage,
              cb
            );
          });
          return cb();
        });
      }
    });
    //Set Scheduler Status Completed
    await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
      if (err) {
        throw new err();
      }
    });
    History.create(`Scheduler Job -${schedularData?.name} Completed`);
  });
}

module.exports = goalStatusNotification;
