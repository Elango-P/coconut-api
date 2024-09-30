/**
 * Module dependencies
 */
const { BAD_REQUEST, DELETE_SUCCESS } = require("../../helpers/Response");

// Services
const productCollectionService = require("../../services/ProductCollectionService");

// Models
const { collection } = require("../../db").models;

/**
 * collection delete route by collection Id
 */
 async function del (req, res, next){
    try{
    const { id } = req.params;

    // Validate collection id
    if (!id) {
        return res.json(BAD_REQUEST, { message: "collection id is required",});
    }

    // Validate collection is exist or not
    const collectionDetails = await collection.findOne({
        where: { id },
    });
    if (!collectionDetails) {
        return res.json(BAD_REQUEST, { message:  "collection not found",});
    }

    await productCollectionService.deleteCollectionProductTag(id);
    // Delete collection
    await collectionDetails.destroy();

    // API response
    res.json(DELETE_SUCCESS, { message: "collection deleted",});
}catch(err){
    console.log(err);
}
};
module.exports = del;
