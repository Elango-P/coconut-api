const { Op } = require("sequelize");

// Models
const { ProjectStatus } = require("../../db").models;

// Jira
const JiraClient = require("../../lib/jira");

// Utils
const ticketUtils = require("../utils/ticket");

// Get Auth
const { getAuth } = require("./getAuth");

module.exports = {
  updateJIRAStatus: (oldStatus, ticket, callback) => {
    if (!ticket.jira_ticket_id) {
      return callback();
    }

    Promise.all([
      ProjectStatus.findOne({
        attributes: ["jira_status"],
        where: {
          project_id: ticket.project_id,
          jira_status: { [Op.ne]: null },
          status: oldStatus,
        },
      }),
      ProjectStatus.findOne({
        attributes: ["jira_status"],
        where: {
          project_id: ticket.project_id,
          jira_status: { [Op.ne]: null },
          status: ticket.status,
        },
      }),
    ]).then(([oldProjectStatus, projectStatus]) => {
      if (!projectStatus) {
        return callback();
      }

      if (
        oldProjectStatus &&
        oldProjectStatus.jira_status === projectStatus.jira_status
      ) {
        return callback();
      }

      getAuth(ticket.project_id, ticket.assigned_to, (err, jiraAuth) => {
        if (!jiraAuth) {
          return callback();
        }

        const jira_status = projectStatus.get().jira_status.toString();

        ticketUtils.getProject(ticket.project_id, (err, project) => {
          if (!project || !project.jira_host || !project.update_jira) {
            return callback();
          }

          const host = project.jira_host;
          const jira_auth_type = project.jira_auth_type;

          const { email, api_token, token } = jiraAuth;

          const auth = { host, email, api_token, token, jira_auth_type };

          JiraClient.getTransitions(
            auth,
            ticket.jira_ticket_id,
            (err, results) => {
              if (!results || !results.transitions) {
                return callback();
              }

              let transition_id = "";
              results.transitions.forEach((result) => {
                if (result.to.id === jira_status) {
                  transition_id = result.id;
                }
              });

              if (!transition_id) {
                return callback();
              }

              return JiraClient.transitionIssue(
                auth,
                ticket.jira_ticket_id,
                transition_id,
                () => callback()
              );
            }
          );
        });
      });
    });
  },
};
