const ObjectName = require("../../helpers/ObjectName");
const Permission = require("../../helpers/Permission");
const { OK } = require("../../helpers/Response");
const Status = require("../../helpers/Status");
const Request = require("../../lib/request");
const StatusService = require("../../services/StatusService");
const { BillService } = require("../../services/services/billService");

async function getPendingBill(req, res, next) {
  try {
    let companyId = Request.GetCompanyId(req);
    let userId = Request.getUserId(req);
    const bill_manage_others = await Permission.Has(Permission.BILL_MANAGE_OTHERS, req);
    let completedStatusDetail = await StatusService.Get(ObjectName.BILL, Status.GROUP_COMPLETED, companyId);
    req.query.companyId = companyId;
    if (completedStatusDetail) {
      req.query.excludeStatus = completedStatusDetail && completedStatusDetail?.id;
    }
    if (bill_manage_others) {
      req.query.bill_manage_others = bill_manage_others;
    }
    if (userId) {
      req.query.userId = userId;
    }
    let data = await BillService.search(req.query, res);
    res.json(OK, data);
  } catch (err) {
    console.log(err);
  }
}

module.exports = getPendingBill;
