const messageService = require("../../services/MessageService");
const create = async (req, res) => {
 await  messageService.create(req,res);
};
module.exports = create;