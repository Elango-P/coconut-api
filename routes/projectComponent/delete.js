const projectComponentService = require("../../services/projectComponentService");

async function del(req, res, next) {
    projectComponentService.del(req,res,next);
    }

module.exports = del;
