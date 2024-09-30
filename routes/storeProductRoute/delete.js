/**
 * Module dependencies
 */
// Status
const { BAD_REQUEST, CREATE_SUCCESS } = require("../../helpers/Response");

// Services
const locationProductService = require("../../services/locationProductService");
const mediaService = require("../../services/MediaService");

/**
 * Store product delete route
 */
async function del(req, res, next){
    const { storeProductId } = req.params;
    try {
        await locationProductService.deleteStoreProductById(storeProductId);

        res.json(CREATE_SUCCESS, {  message: "Store Product Deleted",})

    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, {  message: err.message,})
    }
};
module.exports = del;
