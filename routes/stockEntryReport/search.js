const StockEntryReportService = require("../../services/StockEntryReportService");

async function search(req, res, next) {
 
  StockEntryReportService.search(req, res, next);
}

module.exports = search;