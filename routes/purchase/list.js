
const PurchaseService = require("../../services/services/purchaseService");

const Permission = require("../../helpers/Permission");
const { OK } = require("../../helpers/Response");
const UserService = require("../../services/UserService");

async function list(req, res, next) {
  try{
    const validation = await UserService.validatePermissions(req, res,Permission.PURCHASE_VIEW,Permission.PURCHASE_MANAGE_OTHERS);
    if (!validation) return;
  
    const { companyId, manageOthers } = validation;
  req.query.companyId = companyId
  req.query.purchase_manage_others = manageOthers
  req.query.userId = req.user.id

  let data =  await PurchaseService.search(req.query, res);
  res.json(OK,data);
}catch(err){
  console.log(err);
}
}

module.exports = list;
