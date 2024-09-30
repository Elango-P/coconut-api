const CustomFormFieldDataService = require("../../services/CustomFieldValueService");

const Request = require("../../lib/request");

async function create(req, res, next) {
    try {

        let companyId = Request.GetCompanyId(req);

        let body = req.body;

        await CustomFormFieldDataService.create(body, companyId);

        res.json(200, {
            message: "Custom Field Data Created",
          });

    } catch (err) {
        console.log(err);
        return res.json(400, { message: err.message });
    }
};

module.exports = create;
