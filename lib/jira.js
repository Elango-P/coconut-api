const JiraClient = require("jira-connector");
const restify = require("restify");
const errors = require("restify-errors");
const toTextile = require("to-textile");

// Utils
const utils = require("./utils");

// Constants
const {
  BASIC_AUTHENTICATION,
  BASIC_AUTHENTICATION_WITH_API_TOKEN,
} = require("../helpers/JiraAuth");

const jira = (module.exports = {
  authenticationFailedMessage: "Invalid JIRA Credentials",

  getJiraAuth: (auth) => {
    if (!auth) {
      return "";
    }

    const { host, email, api_token, token, jira_auth_type } = auth;

    const basic_auth = {};

    if (jira_auth_type === BASIC_AUTHENTICATION) {
      basic_auth.base64 = token;
    } else if (jira_auth_type === BASIC_AUTHENTICATION_WITH_API_TOKEN) {
      basic_auth.api_token = api_token;
      basic_auth.email = email;
    }

    const jiraAuth = {
      host,
      basic_auth,
    };

    return jiraAuth;
  },

  get: (auth) => new JiraClient(jira.getJiraAuth(auth)),

  getErrorMessage: (err) => {
    if (err) {
      if (typeof err === "object") {
        return new errors.BadRequestError(JSON.stringify(err));
      }

      return new errors.BadRequestError(jira.authenticationFailedMessage);
    }
  },

  addAttachment: (auth, issueKey, filename, callback) => {
    jira.get(auth).issue.addAttachment({ issueKey, filename }, (err) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback();
    });
  },

  addComment: (auth, issueKey, comment, callback) => {
    jira.get(auth).issue.addComment({ issueKey, comment }, (err) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback();
    });
  },

  getProjects: (auth, callback) => {
    jira.get(auth).project.getAllProjects({}, (err, projects) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback(null, projects);
    });
  },

  getProject: (auth, projectIdOrKey, callback) => {
    jira.get(auth).project.getProject({ projectIdOrKey }, (err, project) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback(null, project);
    });
  },

  getIssueType: (auth, issueTypeId, callback) => {
    jira.get(auth).issueType.getIssueType({ issueTypeId }, (err, issueType) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback(null, issueType);
    });
  },

  createIssue: (auth, data, callback) => {
    jira.get(auth).issue.createIssue(data, (err, result) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback(null, result);
    });
  },

  getAllBoards: (auth, callback) => {
    jira.get(auth).board.getAllBoards({}, (err, result) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback(null, result);
    });
  },

  getSprintsForBoard: (auth, boardId, callback) => {
    jira.get(auth).board.getSprintsForBoard({ boardId }, (err, result) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback(null, result);
    });
  },

  getSprintIssues: (auth, sprintId, callback) => {
    jira
      .get(auth)
      .sprint.getSprintIssues({ sprintId, maxResults: 999 }, (err, result) => {
        if (err) {
          return callback(jira.getErrorMessage(err));
        }

        return callback(null, result);
      });
  },

  getStatus: (auth, statusId, callback) => {
    jira.get(auth).status.getStatus({ statusId }, (err, result) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback(null, result);
    });
  },

  getStatuses: (auth, projectIdOrKey, callback) => {
    jira.get(auth).project.getStatuses({ projectIdOrKey }, (err, result) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback(null, result);
    });
  },

  getVersions: (auth, projectIdOrKey, callback) => {
    jira.get(auth).project.getVersions({ projectIdOrKey }, (err, result) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback(null, result);
    });
  },

  search: (auth, jql, callback) => {
    jira.get(auth).search.search({ jql, maxResults: 999 }, (err, result) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback(null, result);
    });
  },

  getUsersByProject: (auth, project, callback) => {
    jira
      .get(auth)
      .user.searchAssignable({ project, maxResults: 999 }, (err, result) => {
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

  getJiraTicketDetails: (auth, issueKey, callback) => {
    jira.get(auth).issue.getIssue({ issueKey }, (err, result) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback(null, result);
    });
  },

  assignIssue: (auth, issueKey, assignee, callback) => {
    jira.get(auth).issue.assignIssue({ issueKey, assignee }, (err, result) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback(null, result);
    });
  },

  formatText: (description) => {
    if (!description) {
      return "";
    }

    description = utils.replaceAll(description, "[img]", "!");
    description = utils.replaceAll(description, "[/img]", "|thumbnail!");

    const converters = [
      {
        filter: (node) =>
          node.nodeName === "B" ||
          node.nodeName === "STRONG" ||
          (node.nodeName === "SPAN" && node.style.fontWeight === "700") ||
          (node.nodeName === "SPAN" && node.style.fontWeight === "bold"),
        replacement: (content) => `*${content.trim()}* `,
      },
      {
        filter: (node) => node.nodeName === "FONT" && node.color,
        replacement: (content, node) =>
          `{color:${node.color}}${content}{color}`,
      },
      {
        filter: (node) => node.nodeName === "SPAN",
        replacement: (content) => content.trim(),
      },
      {
        filter: "p",
        replacement: (content) => `${content}\r\n\r\n`,
      },
      {
        filter: "a",
        replacement: (content, node) => `[${content}|${node.href}]`,
      },
      {
        filter: (node) =>
          node.style.width === "auto" ||
          (node.color && node.color.indexOf("rgb")),
        replacement: (content) => content,
      },
    ];

    description = toTextile(description, { converters });

    return description.replace(/\\./g, ".");
  },

  //Get Issue Details
  getIssue: (auth, issueKey, callback) => {
    jira.get(auth).issue.getIssue({ issueKey }, (err, result) => {
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

  transitionIssue: (auth, issueKey, transition, callback) => {
    jira
      .get(auth)
      .issue.transitionIssue({ issueKey, transition }, (err, result) => {
        if (err) {
          return callback(jira.getErrorMessage(err));
        }

        return callback(null, result);
      });
  },

  getBoardIssues: (auth, boardId, callback) => {
    jira
      .get(auth)
      .board.getIssuesForBoard({ boardId, maxResults: 999 }, (err, result) => {
        if (err) {
          return callback(jira.getErrorMessage(err));
        }

        return callback(null, result);
      });
  },

  getAllPriorities: (auth, callback) => {
    jira.get(auth).priority.getAllPriorities({}, (err, priority) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback(null, priority);
    });
  },

  getPriority: (auth, priorityId, callback) => {
    jira.get(auth).priority.getPriority({ priorityId }, (err, priorityName) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      return callback(null, priorityName);
    });
  },

  getFieldOptions: (auth, issueKey, fieldName, callback) => {
    jira.get(auth).issue.getEditMetadata({ issueKey }, (err, results) => {
      if (err) {
        return callback(jira.getErrorMessage(err));
      }

      const fields = results && results.fields ? results.fields : {};

      const field = Object.keys(fields).find(
        (key) => fields[key].name === fieldName
      );

      return callback(
        null,
        field && fields[field] && fields[field].allowedValues
          ? fields[field].allowedValues
          : null,
        field && fields[field] && fields[field] && fields[field].key
          ? fields[field].key
          : null
      );
    });
  },
});
