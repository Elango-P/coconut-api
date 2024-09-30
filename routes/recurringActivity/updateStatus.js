const Response = require("../../helpers/Response");
const RecurringActiviteService = require("../../services/RecurringActivityService");

async function updateStatus(req, res, next) {
  try {
    await RecurringActiviteService.updateStatus(req, res, next);
  } 
  catch (err) {
    console.log(err);
    return res.json(Response.BAD_REQUEST, { message: err.message });
  }
}

module.exports = updateStatus;
