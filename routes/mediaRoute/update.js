/**
 * Module dependencies
 */
// Status
const { BAD_REQUEST, UPDATE_SUCCESS } = require("../../helpers/Response");

// Models
const { Media: MediaModel } = require("../../db").models;

// Lib
const Request = require("../../lib/request");

const { Media } = require("../../helpers/Media");

const productConstants = require("../../helpers/Product");

// Service
const MediaService = require("../../services/media");

const ObjectConstants = require("../../helpers/ObjectName");

const { reindex } = require("../../services/ProductService");
const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");
/**
 * orderProduct create route
 */
async function update(req, res, next) {
    try {
        const { status, visibility, feature, objectId, objectName, media_name, image_name, tag_id } = req.body;

        //get media file from request
        const filePath = req && req.files && req.files.media_file;

        const { id } = req.params;

        const companyId = Request.GetCompanyId(req);

        const MediaUpdateData = new Object();

        if (status != null) {
            MediaUpdateData.status = status;
        }

        if (visibility != null) {
            MediaUpdateData.visibility = visibility == Media.VISIBILITY_PUBLIC ? Media.VISIBILITY_PUBLIC : visibility == Media.VISIBILITY_PRIVATE ? Media.VISIBILITY_PRIVATE : Media.VISIBILITY_ARCHIEVE;
        }
        if (objectId) {
            MediaUpdateData.objectId = objectId
        }
        //validate objectName Id exist or not
        if (req.body.name) {
            MediaUpdateData.name = req.body.name
        }

        if (tag_id) {
            MediaUpdateData.tag_id = tag_id
        }

        //validate objectName exist or not
        if (objectName) {
            MediaUpdateData.object_name = objectName;
        }

        if (media_name) {
            MediaUpdateData.file_name = media_name
        }
        if (image_name) {
            MediaUpdateData.name = image_name
        }


        //validate feature exist or not
        if (feature != null) {
            if (feature == productConstants.FEATURE_ENABLED) {
                await MediaService.updateFeature(objectId, objectName, companyId);
            }
            MediaUpdateData.feature = feature == productConstants.FEATURE_ENABLED ? true : false;
        }

        let isMediaExist = await MediaModel.findOne({
            where: { id: id, company_id: companyId }
        })

        if (!isMediaExist) {
            return res.json(400, {
                message: "Media Not Found",
            });
        }

        await MediaModel.update(MediaUpdateData, { where: { id: isMediaExist.id, company_id: companyId } });

        if (isMediaExist) {

            if (media_name) {
                await MediaService.uploadMedia(
                    filePath.path,
                    id,
                    media_name,
                    true
                );
            }
        }
        res.json(UPDATE_SUCCESS, {
            message: "Media Updated",
        });

        res.on("finish", async () => {
            //validate product image uploaded 
            if (objectName == ObjectConstants.PRODUCT && objectId) {
                await reindex(objectId, companyId);
            }
            History.create("Media Updated", req, objectName ? objectName : ObjectName.MEDIA, objectId ? objectId : id);
        });
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message });
    }
}

module.exports = update;
