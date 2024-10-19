
const PurchaseService = require("../../services/services/purchaseService")

const Permission = require("../../helpers/Permission");
const UserService = require("../../services/UserService");

async function create(req, res, next) {
 
  const validation = await UserService.validatePermissions(req, res,Permission.PURCHASE_ADD,Permission.PURCHASE_MANAGE_OTHERS);
  if (!validation) return;

  PurchaseService.create(req, res, next);
}

module.exports = create;