// Model
const projectComponentService = require("../../services/projectComponentService");

async function Get(req, res, next) {
    projectComponentService.Get(req,res,next) 

}

module.exports = Get;