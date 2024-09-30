const { OK } = require("../../helpers/Response");
const PurchaseService = require("../../services/services/purchaseService");

async function updateFromProduct(req, res, next) {
  try {
    const companyId = Request.GetCompanyId(req);

    let params = req.params;
    let data = await PurchaseService.getProduct(params, companyId);
    res.json(OK, data);
  } catch (err) {
    console.log(err);
  }
}

module.exports = updateFromProduct;
