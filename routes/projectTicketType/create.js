
// const projectTicketType = require(".");
const projectTicketTypeService = require("../../services/projectTicketTypeService");

// Models
const { Project } = require("../../db").models;

const create = async (req, res) => {

  projectTicketTypeService.create(req,res);
};
module.exports = create;