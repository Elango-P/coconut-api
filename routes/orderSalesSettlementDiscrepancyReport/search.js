
const Permission = require("../../helpers/Permission");
const salesSettlementDiscrepancyReportService = require("../../services/salesSettlementDiscrepancyReportService")
async function search(req, res) {
  try {
    const hasPermission = await Permission.Has(Permission.SALES_SETTLEMENT_DISCREPANCY_REPORT, req);
    if (!hasPermission) {
      return res.json(400, {
        message: "Permission Denied"
      });
    }
    await salesSettlementDiscrepancyReportService.search(req, res);

  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
}

module.exports = search;
