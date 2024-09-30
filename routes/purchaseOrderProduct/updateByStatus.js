
const purchaseOrderProductService = require("../../services/PurchaseOrderProductService");

async function updateStatus(req, res, next) {
    try {
        purchaseOrderProductService.updateByStatus(req, res, next)
       
      } catch (err) {
        return res.json(400, { message: err.message });
      }
}

module.exports = updateStatus;
