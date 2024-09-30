/**
 * Module dependencies
 */
 const messageservice = require("../../services/MessageService");

/**
 * Tag update route
 */
async function update(req, res, next) {
 
    messageservice.update(req,res,next);
  };
  module.exports = update;
