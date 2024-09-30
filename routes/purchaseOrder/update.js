const purchaseOrderService = require("../../services/PurchaseOrderService");
const Permission = require("../../helpers/Permission");

const update = async (req, res, next) => {
  const hasPermission = await Permission.Has(Permission.PURCHASE_ORDER_EDIT, req);
  if (!hasPermission) {
    return res.json(400, { message: "Permission Denied" });
  }
  try {
    purchaseOrderService.update(req, res, next)
   
  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};

module.exports = update;
