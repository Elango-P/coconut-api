const projectTicketTypeService = require("../../services/projectTicketTypeService");

async function list(req, res, next) {
  try {
    projectTicketTypeService.list(req, res, next);
  } catch (err) {
    console.log(err);
  }
}

module.exports = list;
