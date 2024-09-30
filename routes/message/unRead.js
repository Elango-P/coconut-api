const messageService = require("../../services/MessageService");

/**
 * message unRead route
 */
async function unRead(req, res, next) {
  await messageService.unRead(req,res,next)
}
module.exports = unRead;