// Model
const { Project } = require("../../db").models;
const projectService = require("../../services/ProjectService");


//Lib
const Request = require("../../lib/request");

async function Get(req, res, next) {
    projectService.Get(req,res,next) 

}

module.exports = Get;
0