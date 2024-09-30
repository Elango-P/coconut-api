// Models
const { ProjectUser, JiraAuth } = require("../../db").models;
const { Op } = require("sequelize");

// Constants
const roles = require("../../routes/user/roles");

module.exports = {
  getAuth: (project_id, user_id, callback) => {
    Promise.all([
      ProjectUser.findOne({
        attributes: ["jira_auth_id"],
        where: { project_id, user_id, jira_auth_id: { [Op.ne]: null } },
        include: [
          {
            required: true,
            model: JiraAuth,
            as: "jiraUser",
            attributes: ["id", "token", "jira_user_name", "email", "api_token"],
          },
        ],
      }),
      ProjectUser.findOne({
        where: {
          project_id,
          role: roles.MANAGER,
          jira_auth_id: { [Op.ne]: null },
        },
        include: [
          {
            required: true,
            model: JiraAuth,
            as: "jiraUser",
            attributes: ["id", "token", "jira_user_name", "email", "api_token"],
          },
        ],
      }),
    ]).then(([projectUser, projectManager]) => {
      if (projectUser) {
        const projectJiraUser = projectUser.jiraUser.get();
        return callback(null, projectJiraUser);
      }

      if (projectManager) {
        const projectJiraManagerUser = projectManager.jiraUser.get();
        return callback(null, projectJiraManagerUser);
      }

      return callback();
    });
  },

  /**
   * Get Project Reporter By User Id
   *
   * @param {*} user_id
   * @param {*} project_id
   * @param {*} callBack
   */
  getJiraAccountIdByUserId: (user_id, project_id, callBack) => {
    if (!user_id) {
      return callBack();
    }

    ProjectUser.findOne({
      attributes: ["id", "jira_auth_id"],
      include: [
        {
          required: true,
          model: JiraAuth,
          as: "jiraUser",
          attributes: ["id", "jira_account_id"],
        },
      ],
      where: { user_id, project_id },
    }).then((projectUserDetails) => {
      if (!projectUserDetails) {
        return callBack();
      }

      const { jira_account_id } = projectUserDetails.jiraUser;

      return callBack(null, jira_account_id);
    });
  },
};
