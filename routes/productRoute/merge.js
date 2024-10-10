// Services
const productService = require("../../services/ProductService");

//History
const Permission = require("../../helpers/Permission");

async function update(req, res, next) {

  await productService.merge(req, res)
}
module.exports = update;
