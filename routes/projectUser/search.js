const projectUserService = require("../../services/ProjectUserService");


async function search(req, res, next) {
    projectUserService.search(req,res,next);
    }

module.exports = search;
