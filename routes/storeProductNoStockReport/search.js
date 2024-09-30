
const StoreProductNoStockReportService = require("../../services/StoreProductNoStockReportService");

async function search(req, res, next) {
  try{
    StoreProductNoStockReportService.list(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = search;