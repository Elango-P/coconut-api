const errors = require("restify-errors");
const { Ticket } = require("../../db").models;
const { MANAGER, LEAD } = require("./roles");

function validatePermission(req, ticket_id, callback) {
  Ticket.findOne({
    attributes: ["assigned_to", "project_id"],
    where: { id: ticket_id },
  }).then((ticket) => {
    if (!ticket) {
      return callback(new errors.NotFoundError("Ticket not found"));
    }

    const { assigned_to, project_id } = ticket.get();

    if (
      assigned_to === req.user.id ||
      [MANAGER, LEAD].indexOf(req.projectRoles[parseInt(project_id, 10)]) >= 0
    ) {
      return callback();
    }

    return callback(new errors.UnauthorizedError("You don't have permission"));
  });
}

module.exports = validatePermission;
