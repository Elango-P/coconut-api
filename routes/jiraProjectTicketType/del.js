const errors = require("restify-errors");

// Validator
const validator = require("../../lib/validator");

// Models
const { JiraProjectTicketType } = require("../../db").models;

function del(req, res, next) {
  const id = req.params.id;

  if (!validator.isInteger(id)) {
    return next(new errors.BadRequestError("Invalid jira project ticket type"));
  }

  JiraProjectTicketType.findOne({
    attributes: ["id"],
    where: { id },
  }).then((jiraProjectTicketTypeRelation) => {
    if (!jiraProjectTicketTypeRelation) {
      return next(
        new errors.NotFoundError("Jira project ticket type not found")
      );
    }

    JiraProjectTicketType.destroy({ where: { id } }).then(() => {
      res.json({ message: "Jira project ticket type deleted" });
    });
  }).catch((err)=>{
    console.log(err);
  })
}

module.exports = del;
