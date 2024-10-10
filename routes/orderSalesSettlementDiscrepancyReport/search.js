
const Permission = require("../../helpers/Permission");
const salesSettlementDiscrepancyReportService = require("../../services/salesSettlementDiscrepancyReportService")
async function search(req, res) {
  try {
   
    await salesSettlementDiscrepancyReportService.search(req, res);

  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
}

module.exports = search;
