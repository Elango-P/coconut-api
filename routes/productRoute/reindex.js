// Services
const productService = require("../../services/ProductService");

const Request = require("../../lib/request");
const Response = require("../../helpers/Response");

async function reindex(req, res, next) {
  try {
    const data = req.body;

    const companyId = Request.GetCompanyId(req);

    let productIds = data && data.selectedIds;

    if (productIds && productIds.length == 0) {
      res.json(Response.BAD_REQUEST, { message: "Product is required" });
    }

    if (productIds && productIds.length > 0) {
      for (let i = 0; i < productIds.length; i++) {
        await productService.reindex(productIds[i], companyId);
      }
    }

    res.json(Response.UPDATE_SUCCESS, { message: "Product Reindexed" });
  } catch (err) {
    console.log(err);
  }
}
module.exports = reindex;
