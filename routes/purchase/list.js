
const PurchaseService = require("../../services/services/purchaseService");

const Permission = require("../../helpers/Permission");
const { OK } = require("../../helpers/Response");
const UserService = require("../../services/UserService");
const Request = require("../../lib/request");

async function list(req, res, next) {
  try{

  req.query.companyId = req.user.company_id
  req.query.userId = req.user.id
  req.query.timeZone = Request.getTimeZone(req)

  let data =  await PurchaseService.search(req.query, res);
  res.json(OK,data);
}catch(err){
  console.log(err);
}
}

module.exports = list;
