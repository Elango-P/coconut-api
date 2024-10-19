const Permission = require("../../helpers/Permission");
const { OK } = require("../../helpers/Response");
const ticketService = require("../../services/TicketService");

async function search(req, res, next) {
  const hasPermission = await Permission.Has(Permission.TICKET_VIEW, req);
  if (!hasPermission) {
    return res.json(400, { message: "Permission Denied" });
  }
  const manageOtherPermission = await Permission.Has(
    Permission.TICKET_MANAGE_OTHERS,
    req
  );

  req.query.manageOtherPermission = manageOtherPermission

  let data = await ticketService.search(req, res);
  if (data.totalCount > 0) {
    res.json(OK, data);
  }
}
module.exports = search;
