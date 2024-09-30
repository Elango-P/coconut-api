const Response = require('../../helpers/Response');
const AccountProductService = require('../../services/AccountProductService');

async function bulkupdate(req, res, next) {
  try {
    await AccountProductService.bulkUpdate(req, res, next);
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, {
      message: err.message,
    });
  }
}
module.exports = bulkupdate;
