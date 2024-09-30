const messageService = require("../../services/MessageService");


/**
 * ticket delete route by tag Id
 */
async function del(req, res, next) {
    messageService.del(req,res,next);
    
};
module.exports = del;
