const { BillService } = require("../../services/services/billService");

const Permission = require("../../helpers/Permission");

async function updateStatus(req, res, next) {

  const hasPermission = await Permission.Has(Permission.PURCHASE_EDIT, req);

  if (!hasPermission) {
    return res.json(400, { message: "Permission Denied" });
  }

  BillService.updateStatus(req, res, next);
}

module.exports = updateStatus;
