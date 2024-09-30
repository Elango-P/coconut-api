const projectService = require("../../services/ProjectService");


async function search(req, res, next) {
    projectService.search(req,res,next);
    }

module.exports = search;
