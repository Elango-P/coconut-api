const { BAD_REQUEST, UPDATE_SUCCESS } = require("../../helpers/Response");

const PurchaseProductService = require("../../services/services/PurchaseProductService");

const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");
const Request = require("../../lib/request");
const history = require("../../services/HistoryService");

async function syncToProduct(req, res, next) {
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

        let response = await PurchaseProductService.syncToProduct(params);

        if (response.historyMessage && response.historyMessage.length > 0) {
          let message =response.historyMessage.join();
          history.create(message, req,  ObjectName.PRODUCT, response && response?.productId);
        }
      }
    }

    res.json(UPDATE_SUCCESS, { message: "Product(s) Synced To Product Price" });
  } catch (err) {
    res.json(BAD_REQUEST, { message: err.message });
    console.log(err);
  }
}
module.exports = syncToProduct;
