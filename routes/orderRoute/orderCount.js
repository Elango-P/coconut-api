const Permission = require('../../helpers/Permission');
const { BAD_REQUEST, OK } = require('../../helpers/Response');
const Setting = require("../../helpers/Setting");
const Status = require('../../helpers/Status');
const Request = require('../../lib/request');
const orderService = require('../../services/OrderService');
const { getSettingValue } = require("../../services/SettingService");

async function orderCount(req, res, next) {
  const companyId = Request.GetCompanyId(req);
  const hasPermission = await Permission.Has(Permission.ORDER_MANAGE_OTHERS, req);
  let userDefaultTimeZone =  Request.getTimeZone(req);

  const params = req.query;
  params.companyId = companyId;
  params.userId = Request.getUserId(req);
  params.timeZone =  userDefaultTimeZone

  try {
    let allCount = await orderService.orderCount(params,null, hasPermission);
    let draftCount = await orderService.orderCount(params,Status.GROUP_DRAFT,hasPermission);
    let cancelledCount = await orderService.orderCount(params,Status.GROUP_CANCELLED, hasPermission);

    res.json(OK, { draftCount: draftCount, cancelledCount: cancelledCount, allCount: allCount });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}
module.exports = orderCount;
