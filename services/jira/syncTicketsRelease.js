const async = require("async");
const { Op } = require("sequelize");

// Models
const { ProjectStatus, Ticket, JiraAuth } = require("../../db").models;

// Utils
const utils = require("../../lib/utils");

// Get Issues
const getIssues = require("./getIssues");

// Services
const IndexTicket = require("../indexTicket");

module.exports = {
  syncTicketsRelease: (project_id, release_id, callback) => {
    getIssues(project_id, release_id, (err, issues) => {
      if (err) {
        return callback(err);
      }

      Promise.all([
        ProjectStatus.findAll({
          attributes: ["jira_status", "status", "type", "primary_assignee"],
          where: { project_id },
          order: [["sort"]],
        }),
        JiraAuth.findAll({
          attributes: ["jira_user_name"],
          where: { project_id },
        }),
      ]).then(([projectStatuses, jiraAuths]) => {
        const jiraUsers = [];
        jiraAuths.forEach((jiraAuth) => {
          const jiraUser = jiraAuth.jira_user_name;
          if (jiraUsers.indexOf(jiraUser) < 0) {
            jiraUsers.push(jiraUser);
          }
        });

        const jiraStatusIds = {};
        const jiraStatusType = {};
        const jiraStatusUser = {};

        projectStatuses.forEach((projectStatus) => {
          jiraStatusIds[projectStatus.jira_status] = { status: [] };
        });

        projectStatuses.forEach((projectStatus) => {
          const jiraStatus = projectStatus.jira_status;
          if (!jiraStatusType[jiraStatus]) {
            jiraStatusType[jiraStatus] = projectStatus.type;
          }
          if (!jiraStatusUser[jiraStatus]) {
            jiraStatusUser[jiraStatus] = projectStatus.primary_assignee;
          }

          jiraStatusIds[jiraStatus].status.push(projectStatus.status);
        });

        async.eachSeries(
          issues,
          (issue, cb) => {
            if (jiraUsers.indexOf(issue.jira.assigneeKey) < 0) {
              return cb();
            }

            if (!issue.parentId) {
              return cb();
            }

            const where = {
              [Op.or]: [{ id: issue.parentId }, { parent_id: issue.parentId }],
            };
            const attributes = [
              "id",
              "parent_id",
              "release_id",
              "summary",
              "jira_status_name",
            ];

            Ticket.findOne({ attributes, where }).then((ticketDetails) => {
              if (
                ticketDetails.release_id === release_id &&
                ticketDetails.jira_status_name === issue.jira.status &&
                ticketDetails.summary === utils.rawURLEncode(issue.summary)
              ) {
                return cb();
              }

              ticketDetails
                .update({
                  release_id,
                  jira_status_name: issue.jira.status,
                  summary: utils.rawURLEncode(issue.summary),
                })
                .then(() =>
                  IndexTicket.reIndex(ticketDetails.get().id, () =>
                    cb(null, issue.parentId)
                  )
                );
            });
          },
          () => callback()
        );
      });
    });
  },
};
