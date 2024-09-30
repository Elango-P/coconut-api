/**
 * Module dependencies
 */

const { BAD_REQUEST, UPDATE_SUCCESS } = require("../../helpers/Response");

// Services
const productCollectionService = require("../../services/ProductCollectionService");

// Models
const {  collection } = require("../../db").models;

/**
 * Tag update route
 */
async function update(req, res, next){
    const data = req.body;
    const { id } = req.params;
    const productTagType = data.productTagType;

    // Validate collection id
    if (!id) {
        return res.json(BAD_REQUEST, {  message: "collection id is required",});
    }

    // Validate collection is exist or not
    const collectionDetails = await collection.findOne({
        where: { id },
    });

    if (!collectionDetails) {
        return res.json(BAD_REQUEST, { message: "Invalid collection id",});
    }

    // Update collection details
    const updatecollection = {
        collection_name: data.collectionName,
    };

    try {
        const save = await collectionDetails.updateAttributes(updatecollection);

        await productCollectionService.updateCollectionProductTag(
            id,
            productTagType
        );

        // API response
         res.json(UPDATE_SUCCESS, {
            message: "collection updated",
            data: save.get(),
        });
    } catch (err) {
        console.log(err);
         res.json(BAD_REQUEST, { message: err.message,});
    }
};

module.exports = update;
