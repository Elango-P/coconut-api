const async = require("async");
const { Op } = require("sequelize");

// Models
const {
  models: { Ticket, ProjectStatus, JiraAuth },
} = require("../../db");

// Utils
const utils = require("../../lib/utils");

// Constants
const users = require("../../routes/user/users");

// Get Issues
const { getIssues } = require("./getIssues");
const { getAffectedVersionIssues } = require("./getAffectedVersionIssues");

// Services
const ticketService = require("../ticket");
const IndexTicket = require("../indexTicket");

const syncTickets = (module.exports = {
  createChildTicket: (type_id, parent_id, statusList, ticketData, callback) => {
    Ticket.findOne({
      attributes: ["status", "id"],
      where: { type_id, parent_id },
      order: [["id", "DESC"]],
    }).then((childTicket) => {
      if (!childTicket) {
        ticketData.status = statusList[0];

        return ticketService.createTicket(ticketData, callback);
      }

      if (statusList.indexOf(childTicket.status) >= 0) {
        return callback();
      }

      return childTicket
        .update({
          status: statusList[0],
          status_changed_at: utils.getSQlFormattedDate(),
          jira_status_name: ticketData.jira_status_name,
          summary: ticketData.summary,
        })
        .then(() => IndexTicket.reIndex(childTicket.id, () => callback()));
    });
  },

  createParentTicket: (project_id, release_id, issue, callback) => {
    if (issue.parentId) {
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

      Ticket.findAll({ attributes, where }).then((ticketList) => {
        async.eachSeries(
          ticketList,
          (ticket, ticketCB) => {
            if (
              ticket.release_id === release_id &&
              ticket.jira_status_name === issue.jira.status &&
              ticket.summary === utils.rawURLEncode(issue.summary)
            ) {
              return ticketCB();
            }

            ticket
              .update({
                release_id,
                jira_status_name: issue.jira.status,
                summary: utils.rawURLEncode(issue.summary),
              })
              .then(() =>
                IndexTicket.reIndex(issue.parentId, () =>
                  ticketCB(null, issue.parentId)
                )
              );
          },
          () => callback(null, issue.parentId)
        );
      });
    } else {
      const userId = users.ADMIN;
      const currentDate = utils.getSQlFormattedDate();

      const ticketData = {
        jira_project_ticket_type: issue.jira.projectTicketTypeId,
        project_id,
        release_id,
        summary: utils.rawURLEncode(issue.summary),
        description: utils.rawURLEncode(issue.description),
        jira_ticket_id: issue.jiraId,
        ticket_id: issue.jiraId,
        assigned_to: userId,
        updated_by: userId,
        jira_status_name: issue.jira.status,
        reported_by: userId,
        jira_created_at: currentDate,
        status_changed_at: currentDate,
        reported_date: currentDate,
      };

      return ticketService.createTicket(ticketData, (err, ticket) => {
        if (err) {
          return callback(err);
        }

        return callback(null, ticket.id);
      });
    }
  },

  syncReleaseTickets: (project_id, release_id, callback) => {
    const jiraTicketIds = [];

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
          attributes: ["jira_account_id"],
          where: { project_id },
        }),
      ]).then(([projectStatuses, jiraAuths]) => {
        const jiraUsers = [];
        jiraAuths.forEach((jiraAuth) => {
          const jira_account_id = jiraAuth.jira_account_id;
          if (jiraUsers.indexOf(jira_account_id) < 0) {
            jiraUsers.push(jira_account_id);
          }
        });

        const jiraStatusIds = {},
          jiraStatusType = {},
          jiraStatusUser = {};

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
            jiraTicketIds.push(issue.jiraId);

            if (jiraUsers.indexOf(issue.jira.assigneeJiraAccountId) < 0) {
              return cb();
            }

            syncTickets.createParentTicket(
              project_id,
              release_id,
              issue,
              (err, parent_id) => {
                if (err) {
                  return cb(err);
                }

                return cb();

                const jiraStatusId = issue.jira.statusId;
                const type_id = jiraStatusType[jiraStatusId];
                if (!type_id) {
                  return cb();
                }

                const userId = users.ADMIN;
                const currentDate = utils.getSQlFormattedDate();

                const ticketData = {
                  project_id,
                  release_id,
                  parent_id,
                  type_id,
                  summary: utils.rawURLEncode(issue.summary),
                  description: utils.rawURLEncode(issue.description),
                  jira_ticket_id: issue.jiraId,
                  assigned_to: jiraStatusUser[jiraStatusId] || users.UNASSIGNED,
                  updated_by: userId,
                  reported_by: userId,
                  jira_created_at: currentDate,
                  status_changed_at: currentDate,
                  reported_date: currentDate,
                  jira_status_name: issue.jira.status,
                };

                return syncTickets.createChildTicket(
                  type_id,
                  parent_id,
                  jiraStatusIds[jiraStatusId].status,
                  ticketData,
                  cb
                );
              }
            );
          },
          () => {
            Ticket.findAll({
              attributes: ["id"],
              where: {
                project_id,
                release_id,
                jira_ticket_id: { $notIn: jiraTicketIds },
              },
            }).then((tickets) => {
              async.eachSeries(
                tickets,
                (ticket, ticketCB) => {
                  ticket
                    .update({ release_id: null })
                    .then(() =>
                      IndexTicket.reIndex(ticket.get().id, () => ticketCB())
                    );
                },
                () => callback()
              );
            });
          }
        );
      });
    });
  },

  syncAffectedVersionTickets: (project_id, release_id, callback) => {
    getAffectedVersionIssues(project_id, release_id, (err, issues) => {
      if (err) {
        return callback(err);
      }

      async.eachSeries(
        issues,
        (issue, cb) => {
          const where = {
            [Op.or]: [{ id: issue.ticketId }, { parent_id: issue.ticketId }],
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
              ticketDetails.jira_status_name === issue.jira &&
              issue.jira.status
            ) {
              return cb();
            }

            ticketDetails
              .update({
                release_id,
                jira_status_name: issue.jira ? issue.jira.status : "",
                summary: utils.rawURLEncode(issue.summary),
              })
              .then(() => IndexTicket.reIndex(issue.ticketId, () => cb()));
          });
        },
        () => callback()
      );
    });
  },

  syncTickets: (project_id, release_id, callback) => {
    syncTickets.syncAffectedVersionTickets(project_id, release_id, () => {
      syncTickets.syncReleaseTickets(project_id, release_id, callback);
    });
  },
});
