const StockEntryProductService = require('../../services/StockEntryProductService');

const Request = require("../../lib/request");

async function search(req, res, next) {
  try {
    const body = req.body;

    let companyId = Request.GetCompanyId(req);
    
    await StockEntryProductService.updateStoreQuantity(body, companyId, req);

    //return response
    return res.json(200, {
      message: "Store Product Quantity Updated",
    });
  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
}

module.exports = search;
