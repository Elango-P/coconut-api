const ticketService = require("../../services/TicketService");


const Permission = require("../../helpers/Permission");

async function updateStatus(req, res, next) {

  const hasPermission = await Permission.Has(Permission.TICKET_EDIT, req);

  if (!hasPermission) {
    return res.json(400, { message: "Permission Denied" });
  }

  ticketService.updateStatus(req, res, next);
}

module.exports = updateStatus;
