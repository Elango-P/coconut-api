const errors = require("restify-errors");
const { IndexTicket, Project, TicketPoa } = require("../../db").models;

const processPoaDetails = require("./processPoaDetails");
const getProjectIdsByUser = require("../ticket/getProjectIdsByUser");

function get(req, res, next) {
  const { ticketId, projectSlug } = req.params;

  if (!ticketId) {
    return next(new errors.BadRequestError("Ticket id is required"));
  }

  if (!projectSlug) {
    return next(new errors.BadRequestError("Project slug is required"));
  }

  Project.findOne({
    attributes: ["id"],
    where: { slug: projectSlug },
  }).then((project) => {
    getProjectIdsByUser(
      req.user.id,
      project.get().id.toString(),
      (err, projectIds) => {
        if (err) {
          req.log.error(err);
          return next(err);
        }

        if (!projectIds) {
          return next(new errors.BadRequestError("No Projects Selected"));
        }

        IndexTicket.findOne({
          attributes: [
            "id",
            "ticket_id",
            "external_ticket_id",
            "summary",
            "description",
            "parent_ticket_id",
            "jira_ticket_url",
            "trello_ticket_url",
            "ticket_url",
            "parent_ticket_url",
          ],
          where: {
            ticket_id: ticketId,
            project_id: { $in: projectIds },
          },
        }).then((ticket) => {
          if (!ticket) {
            return next(new errors.NotFoundError("Ticket not found"));
          }

          TicketPoa.findOne({
            attributes: ["id", "details", "attachments", "updated_by"],
            where: {
              id: ticket.id,
            },
          }).then((ticketPoa) => {
            res.json(processPoaDetails(ticket.get(), ticketPoa));
          });
        });
      }
    );
  });
}

module.exports = get;
