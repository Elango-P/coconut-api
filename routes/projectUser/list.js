const projectService = require("../../services/ProjectService");


async function list(req, res, next) {
    projectService.list(req,res,next);
    }

module.exports = list;
