const errors = require("restify-errors");
const { TicketPoa } = require("../../db").models;

function del(req, res, next) {
  const poaId = req.params.poaId;

  TicketPoa.findOne({ where: { id: poaId } })
    .then((ticketPoa) => {
      if (!ticketPoa) {
        return next(new errors.NotFoundError("Ticket POA not found"));
      }
      ticketPoa.destroy({ ticketPoa }).then(() => {
        res.json({ message: "Ticket POA deleted" });
      });
    })
    .catch((err) => {
      req.log.error(err);
      next(err);
    });
}

module.exports = del;
