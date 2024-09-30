// Model
const { Sprint } = require("../../db").models;

//Lib
const Request = require("../../lib/request");
const { sprintService } = require("../../services/SprintService ");

async function Get(req, res, next) {
await    sprintService.get(req,res,next);
}

module.exports = Get;
0