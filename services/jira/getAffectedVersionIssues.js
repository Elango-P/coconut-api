// Models
const { models: { Ticket, Project, ProjectRelease } } = require("../../db");

// Jira Lib
const JiraClient = require("../../lib/jira");
const async = require("async");

// Get Auth
const { getAuth } = require("./getAuth");

module.exports = {
	getAffectedVersionIssues: (projectId, releaseId, callback) => {
		Promise
			.all([
				Project
					.findOne({
						attributes: ["jira_host", "slug", "jira_project_id", "jira_auth_type"],
						where: { id: projectId }
					}),
				ProjectRelease
					.findOne({
						attributes: ["jira_version_id"],
						where: { id: releaseId }
					})
			])
			.then(([project, projectRelease]) => {

				getAuth(projectId, "", (err, jiraAuth) => {
					if (!jiraAuth) {
						return callback(new Error("Configure your JIRA account in settings"));
					}

					if (!project) {
						return callback(new Error("Invalid project"));
					}

					if (!projectRelease) {
						return callback(new Error("Invalid project release"));
					}

					const host = project.jira_host;
					const jiraProjectId = project.jira_project_id;
					const jiraVersionId = projectRelease.jira_version_id;
					const jira_auth_type = project.jira_auth_type;

					if (!host || !jiraVersionId) {
						return callback(new Error("Configure JIRA host in project settings"));
					}

					const { email, api_token, token } = jiraAuth;

					const auth = { host, email, api_token, token, jira_auth_type };

					JiraClient.search(auth, `affectedVersion = ${jiraVersionId}`, (err, results) => {
						if (err) {
							return callback(err);
						}

						const issues = [];
						async.eachSeries(results.issues, (result, cb) => {
							if (result.fields.project.id.toString() !== jiraProjectId.toString()) {
								return cb();
							}

							Ticket
								.findOne({
									attributes: ["id"],
									where: { jira_ticket_id: result.key, project_id: projectId, parent_id: null },
								})
								.then((ticket) => {
									if (!ticket) {
										return cb();
									}

									issues.push({
										ticketId: ticket.id,
										summary: result.fields.summary,
										status: result.fields.status.name,
									});

									return cb();
								});
						}, () => callback(null, issues));
					});
				});
			});
	}
};
