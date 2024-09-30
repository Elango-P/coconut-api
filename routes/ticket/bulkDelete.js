/**
 * Module dependencies
 */
const { BAD_REQUEST } = require("../../helpers/Response");
const ticketService = require("../../services/TicketService");

// Models


const Permission = require("../../helpers/Permission");


async function bulkDelete(req, res, next) {

    const hasPermission = await Permission.Has(Permission.TICKET_DELETE, req);

    if (!hasPermission) {

        return res.json(BAD_REQUEST, { message: "Permission Denied" });
    }

    ticketService.bulkDelete(req, res)
    
};
module.exports = bulkDelete;
