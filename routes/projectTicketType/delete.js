

const projectTicketTypeService = require("../../services/projectTicketTypeService");
// Models


const del = async (req, res) => {

projectTicketTypeService.del(req,res);

}

module.exports = del;