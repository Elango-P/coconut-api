const Response = require("../../helpers/Response");
const Request = require("../../lib/request")
const salesSettlementMisssingReportService = require("../../services/salesSettlementMisssingReportService");
const report = async (req, res, next) => {
    let { page, pageSize, sort, sortDir } = req.query;
    let companyId = Request.GetCompanyId(req);

    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
        return res.json(Response.BAD_REQUEST, { message: "Invalid page" });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
        return res.json(Response.BAD_REQUEST, { message: "Invalid page size" });
    }

    let params = {
        ...req.query,
        sendSlackNotification: false
    }

    let reportList = await salesSettlementMisssingReportService.list(companyId, params);
    const sortReportList = (reportList, sort, sortDir) => {
        reportList.sort((a, b) => {
            let compareA, compareB;

            if (sort === "date") {
                compareA = new Date(a.date);
                compareB = new Date(b.date);
            } else {
                compareA = a[sort];
                compareB = b[sort];
            }

            if (sortDir === "ASC") {
                if (compareA < compareB) return -1;
                if (compareA > compareB) return 1;
            } else if (sortDir === "DESC") {
                if (compareA > compareB) return -1;
                if (compareA < compareB) return 1;
            }

            return 0;
        });
    }

    sortReportList(reportList, sort, sortDir);

    const offset = (page - 1) * pageSize;
    let slicedList = reportList.length <= 25 ? reportList : reportList.slice(offset, offset + pageSize)
    res.json(200, {
        data: slicedList,
        totalCount: reportList && reportList.length,
        currentPage: reportList.length <= 25 ? 1 : page,
        pageSize,
        sort,
        sortDir,
    })
}
module.exports = report