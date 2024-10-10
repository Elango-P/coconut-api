// Status
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const Permission = require("../../helpers/Permission");

// Services
const orderProductService = require("../../services/OrderProductService");

const Request = require("../../lib/request");


async function search(req, res, next) {



  try {
    await orderProductService.search(req, res, next);
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, {
      message: err.message
    });
  }
};
module.exports = search;
