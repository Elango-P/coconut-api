const ticketService = require("../../services/TicketService");
const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");
const Request = require("../../lib/request");
const NotificationService = require("../../services/notifications/ticket");


const createSubTask = async (req, res) => {

  const company_id = Request.GetCompanyId(req);
  try{
  let data = await ticketService.create(req, res);
  res.json(200, {
    message: req?.params?.id ? "Ticket Cloned" : req?.body?.parent_ticket_id ? "Sub Task Add": "Ticket Added",
    ticketDetails: data?.ticketDetails,
  });
  res.on("finish", async () => {
    // Create system log for ticket creation
    if (data?.historyMessage && data?.historyMessage.length > 0) {
      let message = data?.historyMessage.join();
      History.create(`Created with the following: ${message}`, req, ObjectName.TICKET, data?.ticketDetails?.id);
    } else {
      History.create("Ticket Added", req, ObjectName.TICKET, data?.ticketDetails?.id);
    }
    if (req?.body?.assignee_id) {
      NotificationService.sendTicketAssigneeNotification(data?.ticketDetails?.id, req?.user?.id);
    }
    await ticketService.reindex(data?.ticketDetails?.id, company_id);
  });
  }catch(error){
    console.log(err);
    return res.json(400, { message: err.message });
  }


};
module.exports = createSubTask;