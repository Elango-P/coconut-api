const CustomFieldValueService = require("../../services/CustomFieldValueService");

const Request = require("../../lib/request");

async function search(req, res, next) {
    try {

        let companyId = Request.GetCompanyId(req);

        let query = req.query;

        let params = req.params;

        let data = await CustomFieldValueService.search(query, params, companyId);

        res.json(200, data);

    } catch (err) {
        console.log(err);
        return res.json(400, { message: err.message });
    }
};

module.exports = search;
