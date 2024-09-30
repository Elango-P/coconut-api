// Status

const PurchaseReportService = require("../../services/PurchaseReportService");

async function getReport(req, res, next) {
  try {
    await PurchaseReportService.getReport(req,res,next);
  } catch (err) {
    console.log(err);
  }
}
module.exports = getReport;
