
const StoreProductNoOrderReportService = require("../../services/StoreProductNoOrderReportService");

async function search(req, res, next) {
  try{
    StoreProductNoOrderReportService.list(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = search;