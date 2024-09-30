// Status
const { BAD_REQUEST, OK } = require("../../helpers/Response");

// Services
const locationProductService = require("../../services/locationProductService");

const Request = require("../../lib/request");

async function search (req, res, next){
    const params = req.query;
    params.timeZone = Request.getTimeZone(req)

    const companyId = Request.GetCompanyId(req);

    if(!companyId) {
        return res.send(404, {message: "Company Not Found"})
    }
    try {
        const data = await locationProductService.searchStoreProduct(params ,companyId);
        res.json(data)
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message : err.message,})
    }
};

module.exports = search;
