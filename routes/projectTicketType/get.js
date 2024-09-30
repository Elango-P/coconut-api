// Model
const { Project } = require("../../db").models;

const projectTicketTypeService = require("../../services/projectTicketTypeService");


//Lib
const Request = require("../../lib/request");

async function Get(req, res, next) {
  await  projectTicketTypeService.Get(req,res,next) 

}

module.exports = Get;