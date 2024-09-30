const ObjectName = require("../../helpers/ObjectName");
const { BAD_REQUEST, CREATE_SUCCESS } = require("../../helpers/Response");

// Services

const Request = require("../../lib/request");

const locationProductService = require("../../services/locationProductService");
const History = require("../../services/HistoryService");

async function addToStoreProduct(req, res) {
  try {
    let productId = req && req.params && req.params.product_id;
    let locationIds = req.body && req?.body?.locationIds && req?.body?.locationIds?.selectedIds;
    let userId = Request.getUserId(req);

    const companyId = Request.GetCompanyId(req);

    if (!productId) {
      return res.json(BAD_REQUEST, { message: "Product Id is Required" });
    }

    if (!locationIds.length > 0) {
      return res.json(BAD_REQUEST, { message: "Location Id is Required" });
    }

    await locationProductService.addToStoreProduct(locationIds, productId, userId, companyId);

    res.json(CREATE_SUCCESS, { message: "Add to StockEntry Completed" });
    res.on("finish", async () => {
      History.create("Add to StockEntry Completed", req, ObjectName.STOCK_ENTRY);
    });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}
module.exports = addToStoreProduct;
