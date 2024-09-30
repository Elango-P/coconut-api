const Response = require("../../helpers/Response");
const recurringService = require('../../services/RecurringTaskService');

async function updateStatus(req, res, next) {
  try {
    recurringService.updateStatus(req, res, next);
  } 
  catch (err) {
    console.log(err);
    return res.json(Response.BAD_REQUEST, { message: err.message });
  }
}

module.exports = updateStatus;
