
const PurchaseService = require("../../services/services/purchaseService");

const Permission = require("../../helpers/Permission");

async function updateProductStatus(req, res, next) {
  const hasPermission = await Permission.Has(Permission.PURCHASE_VIEW, req);

  if (!hasPermission) {
    return res.json(400, { message: "Permission Denied" });
  }

  PurchaseService.updateProductStatus(req,res, next);
}

module.exports = updateProductStatus;
