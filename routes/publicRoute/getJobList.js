const { loadSettingByName } = require("../../services/SettingService");
const Setting = require("../../helpers/Setting");
const JobService = require("../../services/JobService.js");
const Jobs = require("../../helpers/Jobs.js");
const Request = require("../../lib/request.js");
const ArrayList = require("../../lib/ArrayList.js");



const get = async (req, res, next) => {

    const baseUrl = req.header("origin");

    let companyId;
    let settingList = await loadSettingByName(Setting.ONLINE_SALE_COMPANY);

    if (ArrayList.isNotEmpty(settingList)) {

        let settingData = settingList.find((data) => data.value);

        companyId = settingData ? settingData.get().company_id : await Request.GetCompanyIdBasedUrl(baseUrl);

    } else {
        companyId = await Request.GetCompanyIdBasedUrl(baseUrl);
    }

    let params = {
        status: Jobs.STATUS_ACTIVE
    }

    let jobList = await JobService.list(params, companyId);
    res.json(200, {
        data: jobList
    })





}
module.exports = get;