const { OK } = require("../../helpers/Response");
const Request = require("../../lib/request");
const { BillService } = require("../../services/services/billService");

async function search(req, res, next) {
    try{
        req.query.companyId = Request.GetCompanyId(req)
        req.query.timeZone = Request.getTimeZone(req);

        let data = await BillService.search(req.query,res)
        res.json(OK,data);
    } catch(err){
        console.log(err);
    }
};

module.exports = search;