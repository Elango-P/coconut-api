const { Op } = require("sequelize");

// Models
const { ProjectUser } = require("../../db").models;

// Jira
const JiraClient = require("../../lib/jira");

// Ticket Utils
const ticketUtils = require("../../services/utils/ticket");

// Get Auth
const { getAuth } = require("./getAuth");

module.exports = {
  updateJIRAAssignee: (isUpdate, ticket, callback) => {
    if (!isUpdate || !ticket.jira_ticket_id) {
      return callback();
    }

    getAuth(
      ticket.project_id,
      ticket.assigned_to,
      (err, jiraAuth, jiraUserName) => {
        if (!jiraAuth) {
          return callback();
        }

        ProjectUser.count({
          where: {
            project_id: ticket.project_id,
            user_id: ticket.assigned_to,
            jira_user: { [Op.ne]: null },
          },
        }).then((count) => {
          if (!count) {
            return callback();
          }

          ticketUtils.getProject(ticket.project_id, (err, project) => {
            if (!project || !project.jira_host || !project.update_jira) {
              return callback();
            }

            const { email, api_token, token } = jiraAuth;

            const jira_auth_type = project.jira_auth_type;

            const auth = { host, email, api_token, token, jira_auth_type };

            JiraClient.assignIssue(
              auth,
              ticket.jira_ticket_id,
              jiraUserName,
              () => callback()
            );
          });
        });
      }
    );
  },
};
