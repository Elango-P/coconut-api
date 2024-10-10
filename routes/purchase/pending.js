
const PurchaseService = require("../../services/services/purchaseService");

const Permission = require("../../helpers/Permission");
const Request = require("../../lib/request");
const { OK } = require("../../helpers/Response");
const ObjectName = require("../../helpers/ObjectName");
const Status = require("../../helpers/Status");
const StatusService = require("../../services/StatusService");
const Response = require("../../helpers/Response");
const UserService = require("../../services/UserService");

async function pending(req, res, next) {

  let userId = Request.getUserId(req)
  req.query.companyId = req.user.company_id
  req.query.userId = userId

  let data =  await PurchaseService.search(req.query, res);
  res.json(OK,data);
}

module.exports = pending;
