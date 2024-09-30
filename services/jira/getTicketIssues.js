const async = require("async");
const textile = require("textilejs");

// Models
const { Project, IndexTicket } = require("../../db").models;

// Lib
const JiraClient = require("../../lib/jira");

// Utils
const utils = require("../../lib/utils");

// Constants
const types = require("../../routes/projectTicketType/types");

// Get Auth
const { getAuth } = require("./getAuth");

// Utils
const { rawURLDecode } = require("../../lib/utils");

module.exports = {
  getTicketIssues: (projectId, jiraTicketId, callback) => {
    Project.findOne({
      attributes: ["jira_host", "slug", "jira_project_id", "jira_auth_type"],
      where: { id: projectId },
    }).then((project) => {
      getAuth(projectId, "", (err, jiraAuth) => {
        if (!jiraAuth) {
          return callback(new Error("Configure your JIRA account in settings"));
        }

        if (!project) {
          return callback(new Error("Invalid project"));
        }

        const host = project.jira_host;
        const slug = project.slug;
        const jiraProjectId = project.jira_project_id;
        const jira_auth_type = project.jira_auth_type;

        // Jira Host Configure Error
        if (!host) {
          return callback(new Error("Configure JIRA host in project settings"));
        }

        const { email, api_token, token } = jiraAuth;

        const auth = { host, email, api_token, token, jira_auth_type };

        JiraClient.getIssue(auth, jiraTicketId, (err, result) => {
          if (err) {
            return callback(err);
          }

          const issues = [],
            ticketIds = [];

          if (
            result.fields.project.id.toString() !== jiraProjectId.toString()
          ) {
            return callback();
          }

          let description = result.fields.description;
          if (description) {
            description = textile(description);
            description = description.replace(/!.*thumbnail!/gi, "");
          }

          const jiraId = result.key;

          IndexTicket.findOne({
            attributes: [
              "id",
              "ticket_id",
              "parent_id",
              "summary",
              "type_name",
              "status_name",
              "assigned_to_name",
              "type_id",
            ],
            where: { external_ticket_id: jiraId, project_id: projectId },
          }).then((ticket) => {
            const data = {
              index: 1,
              jiraId,
              projectId,
              summary: result.fields.summary,
              description,
              parentId: "",
              ticket: "",
              devTicket: "",
              qaTicket: "",
              tcTicket: "",
              taskTicket: "",
              jira: {
                ticketId: jiraId,
                ticketUrl: utils.getJiraHostUrl(host, jiraId),
                status: result.fields.status.name,
                projectTicketTypeId: result.fields.issuetype.id,
                statusId: result.fields.status.id,
                summary: result.fields.summary,
                projectTicketTypeName: result.fields.issuetype.name,
                assignee: result.fields.assignee
                  ? result.fields.assignee.displayName
                  : "Unassigned",
                assigneeKey: result.fields.assignee
                  ? result.fields.assignee.key
                  : "",
                assigneeJiraAccountId: result.fields.assignee
                  ? result.fields.assignee.accountId
                  : "",
              },
            };

            if (!ticket) {
              issues.push(data);
              return callback(null, issues);
            }

            ticket = ticket.get();

            const {
              id,
              status_name,
              ticket_id,
              type_name,
              assigned_to_name,
              type_id,
            } = ticket;

            ticketIds.push(id);

            data.typeId = type_id;

            data.ticketId = id;

            data.ticket = {
              ticketId: ticket_id,
              parentId: id,
              status: status_name ? status_name : "",
              assignee: assigned_to_name ? assigned_to_name : "",
              ticketUrl: `/${slug}/${ticket_id}`,
              projectTicketTypeName: type_name ? type_name : "",
            };

            let subTickets = [];

            // Get Child Tickets
            IndexTicket.findAll({
              attributes: [
                "ticket_id",
                "type_name",
                "status_name",
                "summary",
                "assigned_to_name",
                "release_id",
                "project_ticket_type",
              ],
              where: { parent_id: ticket.id },
              order: [["id", "ASC"]],
            }).then((childTickets) => {
              childTickets.forEach((childTicket) => {
                childTicket = childTicket.get();

                // Child Ticket Details
                const {
                  ticket_id,
                  status_name,
                  type_name,
                  summary,
                  assigned_to_name,
                  release_id,
                  project_ticket_type,
                } = childTicket;

                // Sub Tasks Ticket List
                const childData = {
                  summary: rawURLDecode(summary),
                  ticketId: ticket_id,
                  status: status_name ? status_name : "",
                  projectTicketTypeName: type_name ? type_name : "",
                  assignee: assigned_to_name ? assigned_to_name : "",
                  ticketUrl: `/${slug}/${ticket_id}`,
                };

                subTickets.push(childData);
              });

              data.subTickets = subTickets;

              // Ticket Lists
              issues.push(data);

              return callback(null, issues, ticketIds);
            });
          });
        });
      });
    });
  },
};
