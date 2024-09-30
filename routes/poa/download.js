const ejs = require("ejs");
const path = require("path");
const errors = require("restify-errors");
const utils = require("../../lib/utils");
const validator = require("../../lib/validator");
const { TicketPoa, IndexTicket } = require("../../db").models;

function download(req, res, next) {
  const ticket_id = req.params.ticketId;
  const timestamp = req.query.timestamp || Date.now();

  if (!validator.isInteger(ticket_id)) {
    return next(new errors.BadRequestError("Invalid ticket"));
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
    ],
    where: {
      id: ticket_id,
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
      const ticketId = `${ticket.ticket_id}_${timestamp}`;

      ticket.summary = utils.rawURLDecode(ticket.summary);
      ticket.description = utils.rawURLDecode(ticket.description);
      const ticketPoaDetails = JSON.parse(ticketPoa.details);
      ticket.implementationPlan = ticketPoaDetails.implementationPlan
        ? utils.rawURLDecode(ticketPoaDetails.implementationPlan)
        : "There are no implementation plan";
      ticket.useCases = ticketPoaDetails.useCases
        ? utils.rawURLDecode(ticketPoaDetails.useCases)
        : "There are no useCases";
      ticket.ticketAnalysis = ticketPoaDetails.ticketAnalysis
        ? utils.rawURLDecode(ticketPoaDetails.ticketAnalysis)
        : "There are no ticket analysis";
      ticket.screensImpacted = ticketPoaDetails.screensImpacted
        ? utils.rawURLDecode(ticketPoaDetails.screensImpacted)
        : "There are no screen impacted";
      ticket.codeChanges = ticketPoaDetails.codeChanges
        ? utils.rawURLDecode(ticketPoaDetails.codeChanges)
        : "There are no code changes";
      ticket.verificationSteps = ticketPoaDetails.verificationSteps
        ? utils.rawURLDecode(ticketPoaDetails.verificationSteps)
        : "There are no verification steps";
      ticket.risks = ticketPoaDetails.risks
        ? utils.rawURLDecode(ticketPoaDetails.risks)
        : "No risks identified";
      ticket.dependencies = ticketPoaDetails.dependencies
        ? utils.rawURLDecode(ticketPoaDetails.dependencies)
        : "There are no dependencies";
      ticket.queries = ticketPoaDetails.queries
        ? utils.rawURLDecode(ticketPoaDetails.queries)
        : "There are no queries";
      ejs.renderFile(
        path.join(__dirname, "download.ejs"),
        { ticket, ticketId, ticketPoa },
        (err, inputBody) => {
          if (err) {
            return next(err);
          }
          res.setHeader(
            "Content-disposition",
            `attachment; filename=${ticketId}.html`
          );
          res.setHeader("Content-Type", "text/html");
          res.send(inputBody);
        }
      );
    });
  });
}

module.exports = download;
