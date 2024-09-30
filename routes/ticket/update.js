/**
 * Module dependencies
 */
 const ticketService = require("../../services/TicketService");

/**
 * Tag update route
 */
async function update(req, res, next) {
 
    ticketService.update(req,res,next);
  };
  module.exports = update;
