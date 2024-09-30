const Response = require("../../helpers/Response");
const Request = require("../../lib/request");
const stockEntryProductService = require("../../services/StockEntryProductService");

const mobileSearch = async (req, res) => {
  try {
    let params = req.query;
    const companyId = Request.GetCompanyId(req);

    let data = await stockEntryProductService.mobileSearch(params, companyId);
     res.json(Response.OK, {
        totalCount: data?.totalCount,
        currentPage: data?.currentPage,
        pageSize:data?.pageSize,
        data: data?.data,
        sort:data?.sort,
        sortDir:data?.sortDir,
      });
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, { message: err.message });
  }
};

module.exports = mobileSearch;
