const Response = require('../../helpers/Response');
const AccountProductService = require('../../services/AccountProductService');

async function create(req, res, next) {
  try {
    await AccountProductService.create(req, res, next);
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, {
      message: err.message,
    });
  }
}
module.exports = create;
