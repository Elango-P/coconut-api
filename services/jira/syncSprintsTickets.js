const async = require("async");

// Models
const { ProjectStatus, ProjectUser, JiraAuth, Ticket } =
  require("../../db").models;

// Utils
const utils = require("../../lib/utils");

// Constant
const users = require("../../routes/user/users");

// Services
const sprintIssueService = require("./getSprintIssues");
const ticketService = require("../../services/ticket");
const IndexTicket = require("../../services/indexTicket");

const syncSprintsTickets = (module.exports = {
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

  createParentTicket: (project_id, sprint_id, issue, callback) => {
    if (issue.parentId) {
      const where = {
        [Op.or]: [{ id: issue.parentId }, { parent_id: issue.parentId }],
      };
      const attributes = [
        "id",
        "parent_id",
        "sprint_id",
        "summary",
        "jira_status_name",
      ];

      Ticket.findAll({ attributes, where }).then((ticketList) => {
        async.eachSeries(
          ticketList,
          (ticket, ticketCB) => {
            if (
              ticket.sprint_id === sprint_id &&
              ticket.jira_status_name === issue.jira.status &&
              ticket.summary === utils.rawURLEncode(issue.summary)
            ) {
              return ticketCB();
            }

            ticket
              .update({
                sprint_id,
                jira_status_name: issue.jira.status,
                summary: utils.rawURLEncode(issue.summary),
              })
              .then(() =>
                IndexTicket.reIndex(issue.parentId, () =>
                  ticketCB(null, ticket.get().id)
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
        sprint_id,
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

  syncSprintsTickets: (project_id, sprint_id, callback) => {
    const jiraTicketIds = [];

    sprintIssueService.getSprintIssues(project_id, sprint_id, (err, issues) => {
      if (err) {
        return callback(err);
      }

      Promise.all([
        ProjectUser.findAll({
          attributes: ["jira_user", "user_id"],
          include: [
            {
              required: true,
              model: JiraAuth,
              as: "jiraUser",
              attributes: ["id", "token", "jira_account_id"],
            },
          ],
          where: { project_id },
        }),
        ProjectStatus.findAll({
          attributes: ["jira_status", "status", "type", "primary_assignee"],
          where: { project_id },
          order: [["sort"]],
        }),
      ]).then(([projectUsers, projectStatuses]) => {
        const jiraUsers = [];
        projectUsers.length > 0 &&
          projectUsers.forEach((projectUser) => {
            const jiraUser = projectUser.jiraUser;
            const jira_account_id = jiraUser && jiraUser.jira_account_id;
            if (jira_account_id && jiraUsers.indexOf(jira_account_id) < 0) {
              jiraUsers.push(jira_account_id);
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
            jiraTicketIds.push(issue.jiraId);

            if (jiraUsers.indexOf(issue.jira.assigneeJiraAccountId) < 0) {
              return cb();
            }

            syncSprintsTickets.createParentTicket(
              project_id,
              sprint_id,
              issue,
              (err, parent_id) => {
                if (err) {
                  return cb(err);
                }

                const jiraStatusId = issue.jira.statusId;
                const type_id = jiraStatusType[jiraStatusId];
                if (!type_id) {
                  return cb();
                }

                return cb();

                const userId = users.ADMIN;
                const currentDate = utils.getSQlFormattedDate();

                const ticketData = {
                  jira_project_ticket_type: issue.jira.projectTicketTypeId,
                  project_id,
                  sprint_id,
                  parent_id,
                  type_id,
                  summary: utils.rawURLEncode(issue.summary),
                  jira_ticket_id: issue.jiraId,
                  assigned_to: jiraStatusUser[jiraStatusId] || users.UNASSIGNED,
                  description: utils.rawURLEncode(issue.description),
                  updated_by: userId,
                  reported_by: userId,
                  jira_created_at: currentDate,
                  status_changed_at: currentDate,
                  reported_date: currentDate,
                  jira_status_name: issue.jira.status,
                };

                return syncSprintsTickets.createChildTicket(
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
                sprint_id,
                jira_ticket_id: { $notIn: jiraTicketIds },
              },
            }).then((tickets) => {
              async.eachSeries(
                tickets,
                (ticket, ticketCB) => {
                  ticket
                    .update({ sprint_id: null })
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
});
