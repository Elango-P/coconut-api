const async = require("async");
const textile = require("textilejs");

// Models
const { Project, ProjectSprint, IndexTicket } = require("../../db").models;

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
  getSprintIssues: (projectId, sprintId, callback) => {
    Promise.all([
      Project.findOne({
        attributes: ["jira_host", "slug", "jira_project_id", "jira_auth_type"],
        where: { id: projectId },
      }),
      ProjectSprint.findOne({
        attributes: ["jira_sprint_id"],
        where: { id: sprintId },
      }),
    ]).then(([project, projectSprint]) => {
      getAuth(projectId, "", (err, jiraAuth) => {
        if (!jiraAuth) {
          return callback(new Error("Configure your JIRA account in settings"));
        }

        if (!project) {
          return callback(new Error("Invalid project"));
        }

        if (!projectSprint) {
          return callback(new Error("Invalid project sprint"));
        }

        const host = project.jira_host;
        const slug = project.slug;
        const jiraProjectId = project.jira_project_id;
        const jiraSprintId = projectSprint.jira_sprint_id;
        const jira_auth_type = project.jira_auth_type;

        // Jira Host Configure Error
        if (!host || !jiraSprintId) {
          return callback(new Error("Configure JIRA host in project settings"));
        }

        const { email, api_token, token } = jiraAuth;

        const auth = { host, email, api_token, token, jira_auth_type };

        JiraClient.getSprintIssues(auth, jiraSprintId, (err, results) => {
          if (err) {
            return callback(err);
          }

          const issues = [],
            ticketIds = [];

          let index = 0;
          async.eachSeries(
            results.issues,
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

              IndexTicket.findOne({
                attributes: [
                  "id",
                  "ticket_id",
                  "parent_id",
                  "summary",
                  "type_name",
                  "status_name",
                  "assigned_to",
                  "assigned_to_name",
                  "type_id",
                ],
                where: { external_ticket_id: jiraId, project_id: projectId },
              }).then((ticket) => {
                const data = {
                  index,
                  jiraId,
                  projectId,
                  sprintId,
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
                  return cb();
                }

                ticket = ticket.get();

                const {
                  id,
                  status_name,
                  ticket_id,
                  type_name,
                  assigned_to,
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
                  assignedTo: assigned_to ? assigned_to : "",
                  assignee: assigned_to_name ? assigned_to_name : "",
                  ticketUrl: `/${slug}/${ticket_id}`,
                  projectTicketTypeName: type_name ? type_name : "",
                };

                let devTickets = [],
                  qaTickets = [],
                  tcTickets = [],
                  taskTickets = [],
                  subTickets = [];

                // Get Child Tickets
                IndexTicket.findAll({
                  attributes: [
                    "id",
                    "ticket_id",
                    "type_name",
                    "status_name",
                    "summary",
                    "assigned_to",
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
                      id,
                      ticket_id,
                      status_name,
                      type_name,
                      summary,
                      assigned_to,
                      assigned_to_name,
                      release_id,
                      project_ticket_type,
                    } = childTicket;

                    // Sub Tasks Ticket List
                    const childData = {
                      summary: rawURLDecode(summary),
                      ticketId: ticket_id,
                      ticket_Id: id,
                      status: status_name ? status_name : "",
                      projectTicketTypeName: type_name ? type_name : "",
                      assignedTo: assigned_to ? assigned_to : "",
                      assignee: assigned_to_name ? assigned_to_name : "",
                      isError: projectSprint !== release_id,
                      ticketUrl: `/${slug}/${ticket_id}`,
                    };

                    if (
                      project_ticket_type === types.TYPE_DEV_TASK &&
                      !data.devTicket
                    ) {
                      devTickets.push(childData);
                    } else if (
                      project_ticket_type === types.TYPE_QA_TASK &&
                      !data.qaTicket
                    ) {
                      qaTickets.push(childData);
                    } else if (
                      project_ticket_type === types.TYPE_TEST_CASE_TASK &&
                      !data.tcTicket
                    ) {
                      tcTickets.push(childData);
                    } else if (
                      project_ticket_type === types.TYPE_TASK &&
                      !data.taskTicket
                    ) {
                      taskTickets.push(childData);
                    }

                    subTickets.push(childData);
                  });

                  data.devTickets = devTickets;
                  data.qaTickets = qaTickets;
                  data.tcTickets = tcTickets;
                  data.taskTickets = taskTickets;
                  data.subTickets = subTickets;

                  // Ticket Lists
                  issues.push(data);
                  return cb();
                });
              });
            },
            () => callback(null, issues, ticketIds)
          );
        });
      });
    });
  },
};
