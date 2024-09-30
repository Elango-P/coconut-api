const Response = require('../../helpers/Response');
const AccountProductService = require('../../services/AccountProductService');

async function del(req, res, next) {
  try {
    await AccountProductService.del(req, res, next);
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, {
      message: err.message,
    });
  }
}
module.exports = del;
