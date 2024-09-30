const Request = require("../../lib/request");
const invoiceService = require("../../services/invoiceService");

const createRefund = async (req, res, next) => {
  try {
    const params = req.body;
    let companyId = Request.GetCompanyId(req);
    params.companyId=companyId

    await invoiceService.createRefund(params,res)
  } catch (err) {
    console.log(err);
  }
};

module.exports = createRefund;