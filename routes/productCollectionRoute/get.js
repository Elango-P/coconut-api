/**
 * Module dependencies
 */
const { BAD_REQUEST, OK } = require("../../helpers/Response");

// Models
const {  collection, collectionProductTag, Tag } = require("../../db").models;
/**
 * collection get route by collection id
 */
 async function  get(req, res, next){
    try{
    const { id } = req.params;

    // Validate collection id
    if (!id) {
        return res.json(BAD_REQUEST, { message: "Collection id is required",});
    }

    // Validate collection is exist or not
    const collectionDetails = await collection.findOne({
        where: { id },
        include: [
            {
                required: false,
                model: collectionProductTag,
                as: "collectionProductTag",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
                include: [
                    {
                        required: false,
                        model: Tag,
                        as: "tag",
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "deletedAt"],
                        },
                    },
                ],
            },
        ],
    });

    const collectionProductTags = collectionDetails.collectionProductTag;
    const tagDetails = [];
    // Format tag details
    collectionProductTags.forEach(tagType => {
        tagDetails.push({
            id: tagType.tag.id,
            name: tagType.tag.name,
            type: tagType.tag.type,
            status: tagType.tag.status,
        });
    });

    if (!collectionDetails) {
        return res.json(BAD_REQUEST, { message: "collection not found",});
    }
    // API response
    res.json(OK, {
        data: {
            collectionId: collectionDetails.id,
            collectionName: collectionDetails.collection_name,
            collectionProductTag: tagDetails,
        },
    });
} catch (err){
    console.log(err);
}
};

module.exports = get;
