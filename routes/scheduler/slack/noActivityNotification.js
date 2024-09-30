const async = require("async");
const { Op } = require("sequelize");

// Models
const { User, Attendance, Activity, Ticket, Project } =
  require("../../../db").models;

// Utils
const utils = require("../../../lib/utils");

// Constants
const { VALIDATE_NO_ACTIVITIES } = require("../../../helpers/UserConfig");

// Slack Notification
const ticketSlackNotifications = require("../../../services/notifications/ticket");

// User Config Services
const userConfigService = require("../../../services/UserConfigService");

const DateTime = require("../../../lib/dateTime");

const dateTime = new DateTime();

function noActivityNotification(req, res, next) {
  const todayDate = utils.getSQlFormattedDate();
  const currentDateTime = utils.getSQlFormattedDate(
    "",
    dateTime.formats.mySQLDateTimeFormat
  );

  Attendance.findAll({
    attributes: ["login", "user_id"],
    include: [
      {
        required: true,
        model: User,
        as: "user",
        attributes: ["name", "slack_id", "manager"],
      },
    ],
    where: { date: todayDate, login: { [Op.ne]: null }, logout: null },
  }).then((loggedInUsers) => {
    if (loggedInUsers.length > 0) {
      async.eachSeries(loggedInUsers, (loggedInUser, cb) => {
        const { user_id, user } = loggedInUser.get();
        const { slack_id, name, manager } = user.get();

        // Get User Config
        userConfigService.getUserConfigDetailByUserId(
          user_id,
          VALIDATE_NO_ACTIVITIES,
          (err, validate_no_activities) => {
            validateNoActivities =
              validate_no_activities && parseInt(validate_no_activities);
            if (!validateNoActivities) {
              return cb();
            }
            if (validateNoActivities === 1) {
              Activity.findOne({
                attributes: [
                  "start_date",
                  "end_date",
                  "estimated_hours",
                  "ticket_internal_id",
                  "notes",
                  "system_hours",
                ],
                where: { user_id },
                order: [["created_at", "desc"]],
                limit: 1,
              }).then((activityDetails) => {
                if (activityDetails) {
                  const {
                    start_date,
                    end_date,
                    estimated_hours,
                    ticket_internal_id,
                    notes,
                    system_hours,
                  } = activityDetails;

                  if (end_date) {
                    const activityEndTime = utils.getSQLAddedMinutes(
                      15,
                      end_date
                    );
                    const overDueTime = DateTime.getOverDueInHour(end_date);
                    ticketSlackNotifications.sendNoTicketActivityNotification(
                      activityEndTime,
                      currentDateTime,
                      overDueTime,
                      name,
                      manager,
                      slack_id,
                      cb
                    );
                  } else {
                    Ticket.findOne({
                      attributes: ["ticket_id"],
                      where: { id: ticket_internal_id },
                      include: [
                        {
                          required: false,
                          model: Project,
                          as: "project",
                          attributes: ["slug"],
                        },
                      ],
                    }).then((ticket) => {
                      if (ticket) {
                        const taskEstimatedHours =
                          utils.convertToMinutesOnly(estimated_hours);
                        if (!taskEstimatedHours) {
                          return cb();
                        }
                        const systemHours =
                          utils.convertToMinutesOnly(system_hours);
                        const spendTime = taskEstimatedHours - systemHours;
                        const taskActivity = utils.getSQLAddedMinutes(
                          spendTime,
                          start_date
                        );

                        const taskActivityTimeDelay = utils.getSQLAddedMinutes(
                          15,
                          taskActivity
                        );
                        const overDueTime = DateTime.getOverDueInHour(
                          taskActivityTimeDelay
                        );
                        ticketSlackNotifications.sendTaskOverDueNotification(
                          taskActivityTimeDelay,
                          currentDateTime,
                          ticket,
                          ticket.project,
                          notes,
                          overDueTime,
                          name,
                          manager,
                          slack_id,
                          cb
                        );
                      }
                    });
                  }
                }
              });
            }
          }
        );
      });
    }
  });
}

module.exports = noActivityNotification;
