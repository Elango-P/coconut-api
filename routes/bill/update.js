const { BillService } = require("../../services/services/billService");

const Permission = require("../../helpers/Permission");

async function update(req, res, next) {

  const hasPermission = await Permission.Has(Permission.PURCHASE_EDIT, req);

  if (!hasPermission) {
    return res.json(400, { message: "Permission Denied" });
  }

  BillService.update(req, res, next);
}

module.exports = update;
