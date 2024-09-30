
// const projectTicketType = require(".");
const projectComponentService = require("../../services/projectComponentService");

const create = async (req, res) => {

    projectComponentService.create(req,res);
};
module.exports = create;