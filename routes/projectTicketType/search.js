const projectTicketType = require(".");
const projectTicketTypeService = require("../../services/projectTicketTypeService");


async function search(req, res, next) {
    projectTicketTypeService.search(req,res,next);
    }

module.exports = search;
