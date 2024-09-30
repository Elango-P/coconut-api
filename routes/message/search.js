const messageService = require("../../services/MessageService");

/**
 * Vendor search route
 */
async function search(req, res, next) {
  await messageService.search(req,res,next)
}
module.exports = search;