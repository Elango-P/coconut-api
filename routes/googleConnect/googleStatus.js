
const Response = require("../../helpers/Response");
const Setting = require("../../helpers/Setting");
const Request = require("../../lib/request");
const { getSettingValue } = require('../../services/SettingService');


async function GoogleStatus(req, res, next) {
    try {
       const companyId = Request.GetCompanyId(req);
       const accessToken =  await getSettingValue(Setting.GOOGLE_ACCESS_TOKEN, companyId);
       
       const status = accessToken ? 1 : 0;
       return res.json(Response.OK, { data: status })
    } catch (err) {
        console.log(err);
        res.json(Response.BAD_REQUEST, { message: err.message, })
    }
};

module.exports = GoogleStatus;