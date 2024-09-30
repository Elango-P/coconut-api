const { getMediaUrl, getPageDetails } = require("../lib/utils");
const { defaultDateFormat } = require("../lib/dateTime");

// Services
const { Op } = require("sequelize");
const { Media: MediaModal } = require("../db").models;
const MediaServices = require("./media");
const DataBaseService = require("../lib/dataBaseService");
const MediaService = new DataBaseService(MediaModal);
const { Media } = require("../helpers/Media");
const config = require("../lib/config");
const ObjectName = require("../helpers/ObjectName");
const DateTime = require("../lib/dateTime");
const Number = require("../lib/Number");
const Tesseract = require('tesseract.js');  


/**
 * Delete all the store product media by store_id and product id
 *
 * @param {*} storeId
 * @param {*} productId
 */



/**
 * Search store product media
 *
 * @param {*} params
 */


const searchProductMedia = async params => {
    try {
        let {
            page,
            pageSize,
            search,
            sort,
            sortDir,
            pagination,
            productId,
            status,
            object_id,
            object
        } = params;

        // Validate if page is not a number
        page = page ? parseInt(page, 10) : 1;
        if (isNaN(page)) {
            throw { message: "Invalid page" };
        }

        // Validate if page size is not a number
        pageSize = pageSize ? parseInt(pageSize, 10) : 25;
        if (isNaN(pageSize)) {
            throw { message: "Invalid page size" };
        }
        if (sort == "media_name")
            sort = "name"
        // Sortable Fields
        const validOrder = ["ASC", "DESC"];
        const sortableFields = {
            id: "id",
            name: "name",
            status: "status",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        };

        const sortParam = sort || "createdAt";
        // Validate sortable fields is present in sort param
        if (!Object.keys(sortableFields).includes(sortParam)) {
            throw { message: `Unable to sort product by ${sortParam}` };
        }

        const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
        // Validate order is present in sortDir param
        if (!validOrder.includes(sortDirParam)) {
            throw { message: "Invalid sort order" };
        }

        let where = {};

        if (params.storeId) {
            where.store_id = params.storeId;
        }

        if (params.object_id) {
            where.object_id = params.object_id;
        }
        if (params.object) {
            where.object_name = params.object;
        }
        const order = [[sortableFields[sortParam], sortDirParam]]
        if (params.visibility) {
            where.visibility = params.visibility;
        }

        if (search) {
            where[Op.or] = [
                {
                    file_name: { [Op.iLike]: `%${search}%` }
                },
            ];
        };
        const query = {
            attributes: { exclude: ["deletedAt"] },
            order,
            where,
        };

        if (pagination) {
            if (pageSize > 0) {
                query.limit = pageSize;
                query.offset = (page - 1) * pageSize;
            }
        }
        // Get store product media list and count
        const storeProductMediaDetails = await MediaModal.findAndCountAll(
            query
        );
        // Return store product media is null
        if (storeProductMediaDetails.count === 0) {
            return { data: [] };
        }

        const storeProductMediaData = [];

        storeProductMediaDetails.rows.forEach(storeProductMedia => {

            const data = storeProductMedia.get();

            // const { , media } = data;

            const { id, file_name, description, name, createdAt, updatedAt } = data;

            // formate object property
            data.url = file_name ? getMediaUrl(file_name, id) : null;
            data.name = name || "";
            data.file_name = file_name || "";
            data.description = description

            data.createdAt = defaultDateFormat(createdAt);
            data.updatedAt = defaultDateFormat(updatedAt);

            storeProductMediaData.push(data);
        });
        const { count, currentPage, lastPage, pageStart, pageEnd } =
            getPageDetails(
                storeProductMediaDetails.count,
                page,
                pageSize,
                storeProductMediaData.length
            );

        return {
            totalCount: storeProductMediaDetails.count,
            currentPage: page,
            pageSize,
            data: storeProductMediaData,
            sort,
            sortDir,
            search,
            lastPage,
            pageStart,
            pageEnd,
        };
    } catch (err) {
        console.log(err);
    }
};

const getMediaURL = async (mediaId, companyId) => {
    try {
        if (mediaId) {
            let mediaDetail = await MediaService.findOne({
                where: { id: mediaId, company_id: companyId }
            })

            if (mediaDetail) {

                if (mediaDetail.visibility == Media.VISIBILITY_PUBLIC) {
                    return `${config.aws.awsMediaBaseUrl}/${mediaId}-${mediaDetail.file_name}`;

                } else {
                    return `${config.baseUrl}/v1/media/${mediaId}`;

                }
            }
        }
    } catch (err) {
        console.log(err);
    }

}

const create = async (body, uploadFileData, companyId) => {
    try {
        //destructure the body data
        let { object_id, media_name, object, media_visibility, feature, name, tagId } = body;

        const CompressImageObject = [
            ObjectName.TICKET,
            ObjectName.TICKET_TEST,
            ObjectName.VISITOR,
            ObjectName.ATTENDANCE,
            ObjectName.SALE_SETTLEMENT,
        ]

        //validate media fiel exist or not
        if (!uploadFileData) {
            throw { message: "Image Required" };
        }

        //validate name exist or not
        if (!media_name) {
            throw { message: "Media Name Required" };
        }

        const formattedDate = DateTime.getCurrentTimeStamp("YYYYMMDDHHmmss");
        const fileExtension = media_name.split('.').pop();
        const fileName = `${object.toLowerCase()}-${object_id}-${formattedDate}.${fileExtension}`;

        //create image object
        let imageData = {
            file_name: fileName.trim(),
            name: name ? name : fileName.trim(),
            tag_id: tagId ? tagId : null,
            company_id: companyId,
        };

        //validate object Id exist or not
        if (object_id) {
            imageData.object_id = object_id
        }

        //validate object exist or not
        if (object) {
            imageData.object_name = object;
        }

        imageData.status = Media.STATUS_ACTIVE;

        //validate feature exist or not
        if (feature != null) {
            imageData.feature = feature == Media.FEATURE_ENABLED ? true : false;

            if (feature == Media.FEATURE_ENABLED) {
                await MediaServices.updateFeature(object_id, object, companyId);
            }
        }

        //validate media visiblity exist or not
        if (Number.isNotNull(media_visibility)) {
            imageData.visibility = parseInt(media_visibility);
        }

        //create new media
        let mediaDetails = await MediaModal.create(imageData);
        
        //validate media exist or not
        if (mediaDetails) {
            const fileExtension = mediaDetails.file_name.split('.').pop().toLowerCase();
            // Media Upload In S3
            if (fileExtension === 'mp4') {
                await MediaServices.uploadVideoFile(
                    uploadFileData.path,
                    mediaDetails.id,
                    fileName,
                    mediaDetails.visibility == Media.VISIBILITY_PUBLIC ? true : false
                );
            } else if (fileExtension === 'pdf') {
                await MediaServices.uploadPdfFile(
                    uploadFileData.path,
                    mediaDetails.id,
                    fileName,
                    mediaDetails.visibility == Media.VISIBILITY_PUBLIC ? true : false
                );

            } else if (fileExtension === 'm4a') {
                await MediaServices.uploadAudioFile(
                    uploadFileData.path,
                    mediaDetails.id,
                    fileName,
                    mediaDetails.visibility == Media.VISIBILITY_PUBLIC ? true : false
                );

            } else {
                await MediaServices.uploadMedia(
                    uploadFileData.path,
                    mediaDetails.id,
                    fileName,
                    mediaDetails.visibility == Media.VISIBILITY_PUBLIC ? true : false,
                    object ? CompressImageObject.indexOf(object) > -1 ? true : false : true,
                );
            }

        }

        return mediaDetails;

    } catch (err) {
        console.log(err);
    }
}

const getMediaURLByObjectId = async (objectId, objectName, companyId) => {
    try {
        if (objectId && objectName) {
            let mediaDetail = await MediaService.findOne({
                where: { object_id: objectId, object_name: objectName, company_id: companyId }
            })

            if (mediaDetail) {

                if (mediaDetail.visibility == Media.VISIBILITY_PUBLIC) {
                    return { detail: mediaDetail, media_url: `${config.aws.awsMediaBaseUrl}/${mediaDetail.id}-${mediaDetail.file_name}` };
                } else {
                    return { detail: mediaDetail, media_url: `${config.baseUrl}/v1/media/${mediaDetail.id}?mediaName=${mediaDetail.file_name}` };
                }
            }
        }
    } catch (err) {
        console.log(err);
    }

}

const getMediaUrlsByMediaId =(mediaId,fileName,visibility) => {
    try {
        if (mediaId && fileName && visibility) {
                if (visibility == Media.VISIBILITY_PUBLIC) {
                    return `${config.aws.awsMediaBaseUrl}/${mediaId}-${fileName}`;

                } else {
                    return `${config.baseUrl}/v1/media/${mediaId}`;
                }
        }
    } catch (err) {
        console.log(err);
    }

}

const extractTextFromImage = async (imagePath) => {  
    try {
        const { data: { text } } = await Tesseract.recognize(
            imagePath,  
            'eng',  
            {}
        );
        return text; // Return text here
    } catch (err) {  
        console.error('Error:', err);  
        return null; // Return null or handle the error as needed
    }
};
module.exports = {
    searchProductMedia,
    getMediaURL,
    create,
    getMediaURLByObjectId,
    getMediaUrlsByMediaId,
    extractTextFromImage
};
