const { BAD_REQUEST, UPDATE_SUCCESS } = require("../../helpers/Response");

const PurchaseProductService = require("../../services/services/PurchaseProductService");

const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");
const Request = require("../../lib/request");

async function syncToAccountProduct(req, res, next) {
  try {
    const data = req.body;

    let companyId = Request.GetCompanyId(req);

    if (!companyId) {
      res.json(BAD_REQUEST, { message: "CompanyId is Required" });
    }

    if (data?.productIds && !data?.productIds.length > 0) {
      return res.json(BAD_REQUEST, { message: "Select Product(s)" });
    }
    let params;
    if (data?.productIds && data?.productIds.length > 0) {
      for (let i = 0; i < data?.productIds.length; i++) {
        const productId = data?.productIds[i];

         params = {
          companyId: companyId,
          purchaseId: data && data?.purchaseId,
          productId: productId,
        };

        await PurchaseProductService.syncToAccountProduct(params);
      }
    }

    res.json(UPDATE_SUCCESS, { message: "Product(s) Synced To Account Product" });
  } catch (err) {
    res.json(BAD_REQUEST, { message: err.message });
    console.log(err);
  }
}
module.exports = syncToAccountProduct;
