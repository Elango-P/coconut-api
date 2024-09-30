const errors = require("restify-errors");
const { Op } = require("sequelize");

// Models
const { JiraProjectTicketType } = require("../../db").models;

function update(req, res, next) {
  const data = req.body;
  const id = req.params.id;

  const project_id = data.projectId;
  const project_ticket_type_id = data.projectTicketTypeId;
  const jira_project_ticket_type_id = data.jiraProjectTicketTypeId;

  JiraProjectTicketType.findOne({
    attributes: ["id"],
    where: { id },
  }).then((jiraProjectTicketType) => {
    if (!jiraProjectTicketType) {
      return next(
        new errors.NotFoundError("Jira project Ticket Type not found")
      );
    }

    const where = { project_id, project_ticket_type_id, id: { [Op.ne]: id } };

    JiraProjectTicketType.count({ where }).then((jiraProjectTicketTypeExit) => {
      if (jiraProjectTicketTypeExit) {
        return next(
          new errors.BadRequestError("Jira project ticket type already exist")
        );
      }

      JiraProjectTicketType.update(
        {
          project_id,
          project_ticket_type_id,
          jira_project_ticket_type_id,
        },
        { where: { id } }
      ).then(() => {
        res.json({ message: "Jira project ticket type successfully" });
      });
    });
  });
}
module.exports = update;
