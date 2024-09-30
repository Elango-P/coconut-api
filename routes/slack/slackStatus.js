
const { BAD_REQUEST } = require("../../helpers/Response");
const CompanyService = require("../../services/CompanyService");
const request = require("request");
const Setting = require("../../helpers/Setting");
const config = require("../../lib/config");
const { saveSetting, getSettingValue } = require('../../services/SettingService');


async function SlackStatus(req, res, next) {
    try {
       const companyId = Request.GetCompanyId(req);
       const accessTOken =  await getSettingValue(Setting.SLACK_ACCESS_TOKEN, companyId);
       
       const status = accessTOken ? 1 : 0;
       return res.json(200, { data: status })
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }
};

module.exports = SlackStatus;