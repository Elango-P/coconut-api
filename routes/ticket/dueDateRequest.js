const ticketService = require("../../services/TicketService");

const dueDateRequest = async (req, res) => {
 
  ticketService.dueDateRequest(req, res);
};
module.exports = dueDateRequest;