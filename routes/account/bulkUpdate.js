const Response = require('../../helpers/Response');
const AccountService = require("../../services/AccountService")

async function bulkupdate(req, res, next) {
  try {
    await AccountService.bulkUpdate(req, res, next);
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, {
      message: err.message,
    });
  }
}
module.exports = bulkupdate;