const { Media } = require("../../../helpers/Media");
const ObjectName = require("../../../helpers/ObjectName");
const NumberLib = require("../../../lib/Number");
const Request = require("../../../lib/request");
const history = require("../../../services/HistoryService");
const { Visitor, Tag } = require("../../../db").models;
const MediaService = require("../../../services/MediaService");

const create = async (req, res, next) => {
    const baseUrl = req.header("origin");
    let uploadFileData = req?.body?.visitorImage;

    if (uploadFileData) {
        const fileName = uploadFileData.split("\\").pop();
        uploadFileData = fileName;
    }

    let companyId = req?.body?.companyId;
    
    let typeData = req?.body?.type?.toLowerCase(); 

    let typeDetails = await Tag.findOne({
        where: { name: typeData, company_id: req?.body?.companyId },
    });

    let createData = {
        name: req?.body?.name,
        phone: req?.body?.phone,
        purpose: req?.body?.purpose,
        notes: req?.body?.notes,
        title: req?.body?.title,
        company_id: req?.body?.companyId,
        type: typeDetails?.id,
        person_to_meet: null,
    };

    try {
        const response = await Visitor.create(createData);
        let mediaUrl = null;

        if (NumberLib.isNotNull(uploadFileData)) {
            let data = {
                object_id: response.id,
                media_visibility: Media.VISIBILITY_PUBLIC,
                object: ObjectName.VISITOR,
                feature: Media.FEATURE_ENABLED,
                media_name: uploadFileData,
            };

            let mediaDetails = await MediaService.create(data, uploadFileData, req?.body?.companyId);

            if (mediaDetails) {
                mediaUrl = await MediaService.getMediaURL(mediaDetails?.id, companyId);
            }
        }

        res.json({
            status: 200,
            message: "Visitor Added",
            detail: response,
            media_url: mediaUrl,
        });

        history.create("Visitor Added", req, ObjectName.VISITOR, response?.id);
    } catch (error) {
        next(error);
    }
};

module.exports = create;
