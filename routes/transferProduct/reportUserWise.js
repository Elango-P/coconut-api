const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const { OK } = require("../../helpers/Response");
const Request = require("../../lib/request");
const transferProductService = require("../../services/TransferProductService");

async function search(req, res, next) {

  const company_id = Request.GetCompanyId(req);
  if (!company_id) {
    return res.json(Response.BAD_REQUEST, "Company Not Found");
  }
  const hasPermission = await Permission.GetValueByName(
    Permission.TRANSFER_PRODUCT_REPORT_VIEW,
    req.role_permission
  );

  if (!hasPermission) {
    return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
  }
  let {
    page,
    pageSize,
    search,
    sort,
    sortDir,
    pagination,
    user,
    location,
    date,
  } = req.query;
 
  let params = {
    page,
    pageSize,
    search,
    sort,
    sortDir,
    pagination,
    user,
    location,
    date,
    company_id,
  };
  let data = await transferProductService.userWiseReport(params, res);
  res.json(OK, {
    totalCount: data.totalCount,
    currentPage: data.currentPage,
    totalProductCount: data.totalProductCount,
    pageSize: data.pageSize,
    data: data.data,
    search: data.search,
    sort: data.sort,
    sortDir: data.sortDir,
  });
}
module.exports = search;
