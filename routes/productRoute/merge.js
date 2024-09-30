// Services
const productService = require("../../services/ProductService");

//History
const Permission = require("../../helpers/Permission");

async function update(req, res, next) {
  const hasPermission = await Permission.Has(Permission.PRODUCT_EDIT, req);

  if (!hasPermission) {
    return res.json(400, { message: "Permission Denied" });
  }

  await productService.merge(req, res)
}
module.exports = update;
