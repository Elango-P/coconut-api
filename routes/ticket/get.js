
//Lib
const ticketService = require("../../services/TicketService");
async function getdetail(req, res, next) {
 
    ticketService.getdetail(req,res,next);
  };
module.exports = getdetail;