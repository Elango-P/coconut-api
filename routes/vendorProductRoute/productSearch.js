// Status
const { BAD_REQUEST, OK } = require("../../helpers/Response");

// Services
const service = require("../../services/VendorProductService");

const Request = require("../../lib/request");

async function productSearch(req, res, next) {
    const params = req.query;
    const companyId = Request.GetCompanyId(req);

    if (!companyId) {
        return res.send(404, { message: "Company Not Found" })
    }
    try {
        const data = await service.searchVendorProduct(params, companyId);
        res.json(data)
    } catch (err) {
        res.json(BAD_REQUEST, { message: err.message, })
    }
};

module.exports = productSearch;