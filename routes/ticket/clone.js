const ticketService = require("../../services/TicketService");

const clone = async (req, res) => {
  ticketService.create(req, res);
};
module.exports = clone;