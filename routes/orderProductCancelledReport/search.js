const Permission = require("../../helpers/Permission");
const OrderProductCancelledReportService = require("../../services/OrderProductCancelledReportService");

async function search(req, res, next) {
    
OrderProductCancelledReportService.search(req, res, next);
}

module.exports = search;
