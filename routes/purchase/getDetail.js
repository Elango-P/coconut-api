const Request = require('../../lib/request');
const PurchaseProductService = require('../../services/services/PurchaseProductService');
const PurchaseService = require('../../services/services/purchaseService');

async function get(req, res, next) {
  try {
    let companyId = Request.GetCompanyId(req);
    let purchaseId = req.params.id;

    let params = {
      companyId,
      purchaseId,
    };
    let data = await PurchaseService.get(params, res);
    let totalAmount = await PurchaseProductService.getTotalAmount(params);

    if(data && data.data){
    res.json(200, {
      ...data,
      totalAmount: totalAmount,
    });
  }
  } catch (err) {
    console.log(err);
    res.json(400, { message: err.message });
  }
}

module.exports = get;
