
const projectService = require("../../services/ProjectService");

// Models
const { Project } = require("../../db").models;

const create = async (req, res) => {

  projectService.create(req,res);
};
module.exports = create;