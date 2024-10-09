const { Media } = require("../../../helpers/Media");
const ObjectName = require("../../../helpers/ObjectName");
const Number = require("../../../lib/Number");
const Request = require("../../../lib/request");
const history = require("../../../services/HistoryService");
const { Candidate } = require("../../../db").models;
const MediaService = require("../../../services/MediaService");

const create = async (req, res, next) => {

    const baseUrl = req.header("origin");
    const uploadFileData = req && req.files && req.files.resume || req && req?.files && req.files?.profileImage;
    let companyId = req.query.company_id ? req.query.company_id : await Request.GetCompanyIdBasedUrl(baseUrl);

    let knownLanguages = req?.body?.known_languages ? req.body.known_languages.split(',').map(lang => lang.trim()).join(',') : '';

    let createData = {
        first_name: req?.body?.firstName,
        last_name: req?.body?.lastName,
        email: req?.body?.email ? req?.body?.email : "",
        phone: req?.body?.phone ? req?.body?.phone : "",
        company_id: companyId,
        gender: req?.body?.gender ? req?.body?.gender : "",
        qualification: req?.body?.qualification !== "Other" ? req?.body?.qualification : req?.body?.otherQualification ? req?.body?.otherQualification : "",
        department: req?.body?.department !== "Other" ? req?.body?.department : req?.body?.otherDepartment ? req?.body?.otherDepartment : "",
        current_city: req?.body?.city ? req?.body?.city : "",
        current_state: req?.body?.state ? req?.body?.state : "",
        permanent_address: req?.body?.homeTownAddress ? req?.body?.homeTownAddress : "",
        current_address: req?.body?.currentAddress ? req?.body?.currentAddress : "",
        position: req?.body?.position ? req?.body?.position : "",
        known_languages: knownLanguages // Join array back into a string
    };

    await Candidate.create(createData).then(async (response) => {
        let mediaUrl = null;

        if (Number.isNotNull(uploadFileData)) {
            let data = {}
            data.object_id = response.id;
            data.media_visibility = Media.VISIBILITY_PUBLIC;
            data.object = ObjectName.CANDIDATE;
            data.feature = Media.FEATURE_ENABLED;
            data.media_name = uploadFileData?.name

            let mediaDetails = await MediaService.create(data, uploadFileData, companyId);

            if (mediaDetails) {
                mediaUrl = await MediaService.getMediaURL(mediaDetails?.id, companyId);
            }
        }

        res.json(200, {
            message: "Candidate Added",
            detail: response,
            media_url: mediaUrl
        });
        history.create("Candidate Added", req, ObjectName.CANDIDATE, response?.id);
    });
}

module.exports = create;
