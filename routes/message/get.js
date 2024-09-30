
//Lib
const messageService = require("../../services/MessageService");
async function getdetail(req, res, next) {
 
    await messageService.get(req,res,next);
  };
module.exports = getdetail;