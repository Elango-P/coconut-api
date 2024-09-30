const errors = require("restify-errors");
const utils = require("../../lib/utils");
const { IndexTicket, Project, TicketPoa } = require("../../db").models;

const getProjectIdsByUser = require("../ticket/getProjectIdsByUser");

function create(req, res, next) {
  const data = req.body;

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
          attributes: ["id"],
          where: {
            ticket_id: ticketId,
            project_id: { $in: projectIds },
          },
        }).then((ticket) => {
          if (!ticket) {
            return next(new errors.NotFoundError("Ticket not found"));
          }
          const poaData = {
            id: ticket.id,
            updated_by: req.user.id,
            details: {
              implementationPlan:
                utils.rawURLEncode(
                  utils.stripHtmlTags(data.implementationPlan)
                ) || null,
              useCases:
                utils.rawURLEncode(utils.stripHtmlTags(data.useCases)) || null,
              ticketAnalysis:
                utils.rawURLEncode(utils.stripHtmlTags(data.ticketAnalysis)) ||
                null,
              screensImpacted:
                utils.rawURLEncode(utils.stripHtmlTags(data.screensImpacted)) ||
                null,
              codeChanges:
                utils.rawURLEncode(utils.stripHtmlTags(data.codeChanges)) ||
                null,
              verificationSteps:
                utils.rawURLEncode(
                  utils.stripHtmlTags(data.verificationSteps)
                ) || null,
              risks:
                utils.rawURLEncode(utils.stripHtmlTags(data.risks)) || null,
              dependencies:
                utils.rawURLEncode(utils.stripHtmlTags(data.dependencies)) ||
                null,
              queries:
                utils.rawURLEncode(utils.stripHtmlTags(data.queries)) || null,
            },
          };

          TicketPoa.upsert(poaData)
            .then(() => {
              res.json({ message: "POA updated" });
            })
            .catch((err) => {
              req.log.error(err);
              return next(err);
            });
        });
      }
    );
  });
}

module.exports = create;
