const { loadSettingByName } = require("../../services/SettingService");
const Setting = require("../../helpers/Setting");
const Request = require("../../lib/request.js");
const ArrayList = require("../../lib/ArrayList.js");
const MediaService = require("../../services/MediaService.js");
const history = require("../../services/HistoryService.js");



const createMedia = async (req, res, next) => {

    const baseUrl = req.header("origin");
    const uploadFileData = req && req.files && req.files.media_file;
    let companyId;
    let settingList = await loadSettingByName(Setting.ONLINE_SALE_COMPANY);

    if (ArrayList.isNotEmpty(settingList)) {

        let settingData = settingList.find((data) => data.value);

        companyId = settingData ? settingData.get().company_id : await Request.GetCompanyIdBasedUrl(baseUrl);

    } else {
        companyId = await Request.GetCompanyIdBasedUrl(baseUrl);
    }

    let mediaUrl;
    let mediaDetails = await MediaService.create(req?.body, uploadFileData, companyId);

    if (mediaDetails) {
        mediaUrl = await MediaService.getMediaURL(mediaDetails?.id, companyId);
    }

    res.json(200, { message: "Media Added", id: mediaDetails && mediaDetails.id, mediaUrl: mediaUrl });

    res.on("finish", async () => {
        history.create("Media Added", req, req.body.object, req.body.object_id);
    });
}
module.exports = createMedia;