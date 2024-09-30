const JiraClient = require("jira-connector");
const async = require("async");

const jira = module.exports = {
	authenticationFailedMessage: "Invalid JIRA Credentials",
	/**
	 * Get Auth
	 * 
	 * @param {*} auth 
	 * @returns 
	 */
	get: (auth) => new JiraClient({
		host: auth.host,
		basic_auth: {
			email: auth.email,
    		api_token: auth.api_token
		}
	}),

	/**
	 * Error Message
	 * 
	 * @param {*} err 
	 * @returns 
	 */
	getErrorMessage: (err) => {
		if (err) {
			if (typeof err === "object") {
				return new Error(JSON.stringify(err));
			}

			return new Error(jira.authenticationFailedMessage);
		}
	},

	/**
	 * Get Sprints For Board
	 * 
	 * @param {*} auth 
	 * @param {*} boardId 
	 * @param {*} callback 
	 */
	getSprintsForBoard: (auth, boardId, callback) => {
		jira.get(auth).board.getSprintsForBoard({ boardId }, (err, result) => {
			if (err) {
				return callback(jira.getErrorMessage(err));
			}

			return callback(null, result);
		});
	},

	/**
	 * Get Versions
	 * 
	 * @param {*} auth 
	 * @param {*} projectIdOrKey 
	 * @param {*} callback 
	 */
	getVersions: (auth, projectIdOrKey, callback) => {
		jira.get(auth).project.getVersions({ projectIdOrKey }, (err, result) => {
			if (err) {
				return callback(jira.getErrorMessage(err));
			}

			return callback(null, result);
		});
	},

	/**
	 * Get Sprint Issues
	 * 
	 * @param {*} auth 
	 * @param {*} sprintId 
	 * @param {*} callback 
	 */
	getSprintIssues: (auth, sprintId, callback) => {
		jira.get(auth).sprint.getSprintIssues({ sprintId, maxResults: 999 }, (err, result) => {
			if (err) {
				return callback(jira.getErrorMessage(err));
			}

			return callback(null, result);
		});
	},

	/**
	 * Get Releases Issues Tickets
	 * 
	 * @param {*} auth 
	 * @param {*} jql 
	 * @param {*} startAt 
	 * @param {*} maxResults 
	 * @param {*} callBack 
	 */
	getReleasesIssuesTickets: (auth, jql, startAt, maxResults, callBack) => {
		jira.get(auth).search.search({ jql, startAt, maxResults }, (err, result) => callBack(null, result.issues));
	},

	/**
	 * Get Releases Issues
	 * 
	 * @param {*} auth 
	 * @param {*} jql 
	 * @param {*} callback 
	 */
	getReleasesIssues: (auth, jql, callback) => {
		jira.get(auth).search.search({ jql, maxResults: 999 }, (err, result) => {
			if (!result) {
				return callback();
			}

			const number_of_objects = Math.ceil(result.total / 100);
			let limit = 100;
			let startAt = 0;

			async.times(number_of_objects, (n, next) => {
				const index = n + 1;
				jira.getReleasesIssuesTickets(auth, jql, startAt, limit, (err, user) => {
					next(err, user);
				});
				limit = 100 * index;
				startAt = index * 100;
			}, (err, tickets) => {
				if (err) {
					return callback(jira.getErrorMessage(err));
				}

				return callback(null, [].concat.apply([], tickets));
			});
		});
	},

	/**
	 * Jira Search
	 * 
	 * @param {*} auth 
	 * @param {*} jql 
	 * @param {*} callback 
	 */
	search: (auth, jql, callback) => {
		jira.get(auth).search.search({ jql, maxResults: 999 }, (err, result) => {
			if (err) {
				return callback(jira.getErrorMessage(err));
			}

			return callback(null, result);
		});
	},

	currentUser: (auth, callback) => {
		jira.get(auth).myself.getMyself({}, (err, result) => {
			if (err) {
				return callback(jira.getErrorMessage(err));
			}

			return callback(null, result);
		});
	},

	/**
	 * Assignee Issue
	 * 
	 * @param {*} auth 
	 * @param {*} issueKey 
	 * @param {*} assignee 
	 * @param {*} callback 
	 */
	assignIssue: (auth, issueKey, assignee, callback) => {
		jira.get(auth).issue.assignIssue({ issueKey, assignee }, (err, result) => {
			if (err) {
				return callback(jira.getErrorMessage(err));
			}

			return callback(null, result);
		});
	},

	getTransitions: (auth, issueKey, callback) => {
		jira.get(auth).issue.getTransitions({ issueKey }, (err, result) => {
			if (err) {
				return callback(jira.getErrorMessage(err));
			}

			return callback(null, result);
		});
	},

	/**
	 * Transition Issue
	 * 
	 * @param {*} auth 
	 * @param {*} issueKey 
	 * @param {*} transition 
	 * @param {*} callback 
	 */
	transitionIssue: (auth, issueKey, transition, callback) => {
		jira.get(auth).issue.transitionIssue({ issueKey, transition }, (err, result) => {
			if (err) {
				return callback(jira.getErrorMessage(err));
			}

			return callback(null, result);
		});
	},

	getBoardIssues: (auth, boardId, callback) => {
		jira.get(auth).board.getIssuesForBoard({ boardId, maxResults: 999 }, (err, result) => {
			if (err) {
				return callback(jira.getErrorMessage(err));
			}

			return callback(null, result);
		});
	}
};
