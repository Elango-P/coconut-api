const ticketService = require("../../services/TicketService");


const Permission = require("../../helpers/Permission");

async function updateStatus(req, res, next) {

 

  ticketService.updateStatus(req, res, next);
}

module.exports = updateStatus;
