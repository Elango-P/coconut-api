const purchaseOrderService = require("../../services/PurchaseOrderService");
const Permission = require("../../helpers/Permission");

const update = async (req, res, next) => {

  try {
    purchaseOrderService.update(req, res, next)
   
  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};

module.exports = update;
