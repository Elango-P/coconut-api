const projectTicketTypeService = require("../../services/projectTicketTypeService");



/**
 * Sprint update route
 */
async function update(req, res, next) {
     projectTicketTypeService.update(req,res,next);
};

module.exports = update;
