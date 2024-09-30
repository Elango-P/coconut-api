// Status

const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const PurchaseService = require("../../services/services/purchaseService");
async function search(req, res, next) {
  try {

    const hasPermission = await Permission.Has(Permission.PURCHASE_REPORT_VENDOR_WISE_VIEW, req);

    if (!hasPermission) {
      return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
    }
    let params =  req.query

    const companyId = Request.GetCompanyId(req);

    let data = await PurchaseService.report(params,companyId);

    res.json(data)
  } catch (err) {
    console.log(err);
  }
}
module.exports = search;
