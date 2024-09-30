const { Op } = require("sequelize");

// Models
const { ProjectRelease } = require("../../db").models;

// Utils
const utils = require("../../lib/utils");
const async = require("async");

// Jira Client
const JiraClient = require("../../lib/jira");

// Service
const projectService = require("../project");

// Get Auth
const { getAuth } = require("./getAuth");

const syncReleases = (module.exports = {
  syncVersions: (auth, data, callback) => {
    const { project_id, jiraProjectId } = data;

    JiraClient.getVersions(auth, jiraProjectId, (err, results) => {
      if (err) {
        return callback(err);
      }

      const versions = {};
      if (results.length > 0) {
        results.forEach((result) => {
          const versionId = result.id;
          versions[versionId] = {
            name: result.name,
            date: result.releaseDate
              ? utils.getSQlFormattedDate(result.releaseDate)
              : result.releaseDate,
            startDate: result.startDate
              ? utils.getSQlFormattedDate(result.startDate)
              : result.startDate,
            endDate: result.releaseDate
              ? utils.getSQlFormattedDate(result.releaseDate)
              : result.releaseDate,
            state: result.released,
          };
        });
      }

      async.eachSeries(
        Object.keys(versions),
        (jira_version_id, cb) => {
          const versionDetail = versions[jira_version_id];
          const name = versionDetail.name;

          const data = {
            project_id,
            date: versionDetail.date,
            status: versionDetail.state ? 0 : 1,
            start_date: versionDetail.startDate,
            end_date: versionDetail.endDate,
            name,
            jira_version_id,
          };

          ProjectRelease.findOne({
            attributes: ["id"],
            where: { project_id, [Op.or]: [{ name }, { jira_version_id }] },
          }).then((projectRelease) => {
            if (projectRelease) {
              projectRelease.update(data).then(() => cb());
            } else {
              ProjectRelease.create(data).then(() => cb());
            }
          });
        },
        () => callback()
      );
    });
  },

  syncReleases: (project, callback) => {
    getAuth(project.id, "", (err, jiraAuth) => {
      if (!jiraAuth) {
        return callback(new Error("Configure your JIRA account in settings"));
      }

      const { jira_auth_type } = project;

      const { email, api_token, token } = jiraAuth;

      const auth = {
        host: project.jira_host,
        email,
        api_token,
        token,
        jira_auth_type,
      };

      const data = {
        project_id: project.id,
        jiraProjectId: project.jira_project_id,
        jiraBoardId: project.jira_board_id,
      };

      syncReleases.syncVersions(auth, data, (err) => {
        if (err) {
          return callback(err);
        }

        return projectService.updateIndex(project.id, () => callback());
      });
    });
  },
});
