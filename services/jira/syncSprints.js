const async = require("async");
const { Op } = require("sequelize");

// Models
const { ProjectSprint } = require("../../db").models;

// Utils
const utils = require("../../lib/utils");

// Jira
const JiraClient = require("../../lib/jira");

// Project Service
const projectService = require("../project");

// Get Auth
const { getAuth } = require("./getAuth");

const syncSprints = (module.exports = {
  syncBoards: (auth, data, callback) => {
    const { project_id, jiraBoardId } = data;

    JiraClient.getSprintsForBoard(auth, jiraBoardId, (err, results) => {
      if (err) {
        return callback(err);
      }

      const sprints = {};
      if (results.values.length > 0) {
        results.values.forEach((result) => {
          const sprintId = result.id;

          sprints[sprintId] = {
            name: result.name,
            state: result.state,
            startDate: result.startDate
              ? utils.getSQlFormattedDate(result.startDate)
              : result.startDate,
            endDate: result.releaseDate
              ? utils.getSQlFormattedDate(result.endDate)
              : result.endDate,
          };
        });
      }

      async.eachSeries(
        Object.keys(sprints),
        (jira_sprint_id, cb) => {
          const sprintDetail = sprints[jira_sprint_id];

          const { name, state, startDate, endDate } = sprintDetail;

          let status = 1;
          if (state === "closed") {
            status = 0;
          } else if (state === "future") {
            status = 2;
          }

          const data = {
            name,
            project_id,
            status,
            start_date: startDate,
            end_date: endDate,
            jira_sprint_id,
          };

          ProjectSprint.findOne({
            where: { project_id, [Op.or]: [{ name }, { jira_sprint_id }] },
          }).then((projectSprint) => {
            if (projectSprint) {
              projectSprint.update(data).then(() => cb());
            } else {
              ProjectSprint.create(data).then(() => cb());
            }
          });
        },
        () => callback()
      );
    });
  },

  syncSprints: (project, callback) => {
    getAuth(project.id, "", (err, jiraAuth) => {
      if (!jiraAuth) {
        return callback(new Error("Configure your JIRA account in settings"));
      }

      const jira_auth_type = project.jira_auth_type;
      const host = project.jira_host;

      const { email, api_token, token } = jiraAuth;

      const auth = { host, email, api_token, token, jira_auth_type };

      const data = {
        project_id: project.id,
        jiraProjectId: project.jira_project_id,
        jiraBoardId: project.jira_board_id,
      };

      syncSprints.syncBoards(auth, data, (err) => {
        if (err) {
          return callback(err);
        }

        return projectService.updateIndex(project.id, () => callback());
      });
    });
  },
});
