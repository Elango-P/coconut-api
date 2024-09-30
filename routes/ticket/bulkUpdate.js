/**
 * Module dependencies
 */

const ticketService = require("../../services/TicketService");

// Models

async function bulkUpdate(req, res, next) {

  ticketService.bulkUpdate(req, res);

}
module.exports = bulkUpdate;
