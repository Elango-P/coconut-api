const errors = require("restify-errors");

// Validator
const validator = require("../../lib/validator");

// Models
const { JiraProjectTicketType } = require("../../db").models;

function create(req, res, next) {
  const data = req.body;

  const project_id = data.projectId;
  const project_ticket_type_id = data.projectTicketTypeId;
  const jira_project_ticket_type_id = data.jiraProjectTicketTypeId;

  const validations = [
    { value: project_id, label: "Project", type: "integer" },
    {
      value: project_ticket_type_id,
      label: "Project ticket type",
      type: "integer",
    },
    {
      value: jira_project_ticket_type_id,
      label: "Jira Parent ticket type",
      type: "integer",
    },
  ];

  validator.validateFields(validations, (err) => {
    if (err) {
      return next(err);
    }

    JiraProjectTicketType.findOne({
      attributes: ["id"],
      where: { project_id, project_ticket_type_id },
    }).then((jiraProjectTicketTypeExists) => {
      if (jiraProjectTicketTypeExists) {
        return next(
          new errors.BadRequestError("Jira Project Ticket Type already exists")
        );
      }

      JiraProjectTicketType.create({
        project_id,
        project_ticket_type_id,
        jira_project_ticket_type_id,
      }).then((jiraProjectTicketType) => {
        res.json(201, {
          message: "Jira project ticket type added",
          jiraProjectTicketTypeId: jiraProjectTicketType.get().id,
        });
      }).catch((err)=>{
        console.log(err);
      })
    });
  });
}

module.exports = create;
