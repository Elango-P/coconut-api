const projectComponentService = require("../../services/projectComponentService");

async function search(req, res, next) {
    projectComponentService.search(req,res,next);
    }

module.exports = search;
