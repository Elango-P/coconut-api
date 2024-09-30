/**
 * Module dependencies
 */
const { BAD_REQUEST, OK } = require ("../../helpers/Response");

// Models
const { collection } = require("../../db").models;

/**
 * Create collection route
 */
 async function create (req, res, next){
    const data = req.body;

    // Validate name
    if (!data.collectionName) {
        return res.json(BAD_REQUEST, { message: "Name is required"});
    }

    // collection data
    const collectionData = {
        collection_name: data.collectionName,
    };

    try {
        const collectionName = data.collectionName.trim();
        // Validate duplicate collection name
        const collectionExist = await collection.findOne({
            where: { collection_name: collectionName },
        });
        if (collectionExist) {
            return res.json(BAD_REQUEST, { message:  "Collection name already exist"});
        }
        // Create collection
        await collection.create(collectionData);

        // API response
         res.json(OK, { message:  "collection added",});
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message});
    }
};

module.exports = create;
