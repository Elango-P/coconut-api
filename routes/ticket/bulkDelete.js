/**
 * Module dependencies
 */
const { BAD_REQUEST } = require("../../helpers/Response");
const ticketService = require("../../services/TicketService");

// Models


const Permission = require("../../helpers/Permission");


async function bulkDelete(req, res, next) {

 

    ticketService.bulkDelete(req, res)
    
};
module.exports = bulkDelete;
