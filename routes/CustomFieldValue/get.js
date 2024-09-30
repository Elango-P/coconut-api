const CustomFieldValueService = require("../../services/CustomFieldValueService");

const Request = require("../../lib/request");

async function get(req, res, next) {
    try {

        let companyId = Request.GetCompanyId(req);
        let timeZone = Request.getTimeZone(req)

        let query = req.query;

        let params = req.params;
        if(timeZone){
            params.timeZone = timeZone
        }

        let customFieldData = await CustomFieldValueService.get(query, params, companyId);

        res.json(200, customFieldData);

    } catch (err) {
        console.log(err);
        return res.json(400, { message: err.message });
    }
};

module.exports = get;
