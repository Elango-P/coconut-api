const ObjectName = require("../../helpers/ObjectName");
const Permission = require("../../helpers/Permission");
const { OK } = require("../../helpers/Response");
const Status = require("../../helpers/Status");
const Request = require("../../lib/request");
const { paymentService } = require("../../services/PaymentService");
const StatusService = require("../../services/StatusService");

async function getPendingPayments(req, res, next) {
  try {
    let companyId = Request.GetCompanyId(req);
    let userId = Request.getUserId(req);
    const payment_manage_others = await Permission.Has(Permission.PAYMENT_MANAGE_OTHERS, req);
    let completedStatusDetail = await StatusService.Get(ObjectName.PAYMENT, Status.GROUP_COMPLETED, companyId);
    req.query.companyId = companyId;
    if (completedStatusDetail) {
      req.query.excludeStatus = completedStatusDetail && completedStatusDetail?.id;
    }
    if (payment_manage_others) {
      req.query.payment_manage_others = payment_manage_others;
    }
    if (userId) {
      req.query.user = userId;
    }

       await paymentService.search(req, res,next);
  } catch (err) {
    console.log(err);
  }
}

module.exports = getPendingPayments;
