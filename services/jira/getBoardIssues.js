const async = require("async");
const textile = require("textilejs");

// Models
const {
  models: { Ticket, TicketStatus, Project, User },
} = require("../../db");

// Jira Lib
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
  getBoardIssues: (projectId, jiraBoardId, callback) => {
    if (!jiraBoardId) {
      return callback(new Error("JIRA board is required"));
    }

    Project.findOne({
      attributes: ["jira_host", "slug", "jira_project_id", "jira_auth_type"],
      where: { id: projectId },
    }).then((project) => {
      if (!project) {
        return callback(new Error("Invalid project"));
      }

      getAuth(projectId, "", (err, jiraAuth) => {
        if (!jiraAuth) {
          return callback(new Error("Configure your JIRA account in settings"));
        }

        const host = project.jira_host;
        const slug = project.slug;
        const jiraProjectId = project.jira_project_id;
        const jira_auth_type = project.jira_auth_type;

        if (!host || !jiraBoardId) {
          return callback(new Error("Configure JIRA host in project settings"));
        }

        const { email, api_token, token } = jiraAuth;

        const auth = { host, email, api_token, token, jira_auth_type };

        JiraClient.getBoardIssues(auth, jiraBoardId, (err, results) => {
          if (err) {
            return callback(err);
          }

          const issues = [];

          let index = 0;
          async.eachSeries(
            results.issues || [],
            (result, cb) => {
              if (
                result.fields.project.id.toString() !== jiraProjectId.toString()
              ) {
                return cb();
              }

              let description = result.fields.description;
              if (description) {
                description = textile(description);
                description = description.replace(/!.*thumbnail!/gi, "");
              }

              index = index + 1;
              const jiraId = result.key;

              const include = [
                {
                  required: false,
                  model: TicketStatus,
                  as: "ticketStatus",
                  attributes: ["name"],
                  where: { status: 1 },
                },
                {
                  required: false,
                  model: User,
                  as: "user",
                  attributes: ["name"],
                },
              ];

              Ticket.findOne({
                attributes: ["id", "ticket_id"],
                where: { jira_ticket_id: jiraId, project_id: projectId },
                include,
              }).then((ticket) => {
                const data = {
                  index,
                  jiraId,
                  projectId,
                  summary: result.fields.summary,
                  description,
                  parentId: "",
                  ticket: "",
                  devTicket: "",
                  qaTicket: "",
                  tcTicket: "",
                  jira: {
                    ticketId: jiraId,
                    summary: result.fields.summary,
                    ticketUrl: utils.getJiraHostUrl(host, jiraId),
                    status: result.fields.status.name,
                    statusId: result.fields.status.id,
                    assignee: result.fields.assignee
                      ? result.fields.assignee.displayName
                      : "Unassigned",
                    assigneeKey: result.fields.assignee
                      ? result.fields.assignee.key
                      : "",
                  },
                };

                if (!ticket) {
                  issues.push(data);
                  return cb();
                }

                ticket = ticket.get();

                data.parentId = ticket.id;
                data.ticket = {
                  ticketId: ticket.ticket_id,
                  status: ticket.ticketStatus ? ticket.ticketStatus.name : "",
                  assignee: ticket.user ? ticket.user.name : "",
                  ticketUrl: `/${slug}/${ticket.ticket_id}`,
                };

                const subTaskTickets = [];
                subTickets = [];
                Ticket.findAll({
                  attributes: ["type_id", "ticket_id", "summary"],
                  where: { parent_id: ticket.id },
                  include,
                  order: [["id", "DESC"]],
                }).then((childTickets) => {
                  childTickets.forEach((childTicket) => {
                    childTicket = childTicket.get();
                    const childData = {
                      ticketId: childTicket.ticket_id,
                      summary: rawURLDecode(childTicket.summary),
                      status: childTicket.ticketStatus
                        ? childTicket.ticketStatus.name
                        : "",
                      assignee: childTicket.user ? childTicket.user.name : "",
                      ticketUrl: `/${slug}/${childTicket.ticket_id}`,
                    };

                    const type_id = childTicket.type_id;
                    if (type_id === types.TYPE_DEV_TASK && !data.devTicket) {
                      data.devTicket = childData;
                    } else if (
                      type_id === types.TYPE_QA_TASK &&
                      !data.qaTicket
                    ) {
                      data.qaTicket = childData;
                    } else if (
                      type_id === types.TYPE_TEST_CASE_TASK &&
                      !data.tcTicket
                    ) {
                      data.tcTicket = childData;
                    }

                    subTaskTickets.push(childData);
                    subTickets.push(childData);
                  });

                  data.subTaskTickets = subTaskTickets;
                  data.subTickets = subTickets;
                  issues.push(data);
                  return cb();
                });
              });
            },
            () => callback(null, issues)
          );
        });
      });
    });
  },
};
