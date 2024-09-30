const ticketService = require("../../services/TicketService");

const etaRequest = async (req, res) => {
 
  ticketService.etaRequest(req, res);
};
module.exports = etaRequest;