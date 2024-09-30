// Models
const { ProjectUser, IndexProject } = require("../../db").models;

function projectQuickLinks(req, res) {
  const user_id = req.user.id;

  IndexProject.findAndCountAll({
    attributes: [
      "id",
      "name",
      "code",
      "slug",
      "last_ticket_id",
      "jira_host",
      "sort",
      "status",
      "status_text",
      "slack_webhook_key",
      "allow_manual_id",
      "jira_project_id",
      "trello_board_id",
    ],
    include: [
      {
        required: true,
        model: ProjectUser,
        as: "projectUser",
        where: { user_id },
      },
    ],
    where: { status: 1 },
    order: [
      ["sort", "ASC"],
      ["name", "ASC"],
    ],
  }).then((projects) => {
    const projectQuickLinkLists = [];
    projects.rows.forEach((project) => {
      project = project.get();

      projectQuickLinkLists.push({
        id: project.id,
        name: project.name,
        code: project.code,
        slug: project.slug,
        lastTicketId: project.last_ticket_id,
        jiraHost: project.jira_host,
        sort: project.sort,
        status: project.status,
        statusText: project.status_text,
        slackWebhookKey: project.slack_webhook_key,
        jira_project_id: project.jira_project_id,
        trello_board_id: project.trello_board_id,
        isEdit: project.slack_webhook_key ? project.slack_webhook_key : null,
      });
    });
    res.json(projectQuickLinkLists);
  });
}

module.exports = projectQuickLinks;
