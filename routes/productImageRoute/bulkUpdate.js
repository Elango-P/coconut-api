/**
 * Module dependencies
 */
const async = require("async");

// Constants
const { BAD_REQUEST, OK } = require("../../helpers/Response");

// Services
const productImageService = require("../../services/ProductImageService");

/**
 * Product image bulk update route
 */
async function bulkUpdate(req, res, next) {
    try{
    const data = req.body;
    const productImageIds = data.ids;

    // Validate product image id
    if (!productImageIds) {
        return res.json(BAD_REQUEST, { message: "Product image id is required" });
    }

    for (let i = 0; i < productImageIds.length; i++) {
        try {
            await productImageService.updateProductImage(
                productImageIds[i],
                data
            );
        } catch (err) {
            res.json(BAD_REQUEST, { message: err.message });
        }
    }
    res.json(OK, { message: "Product image(s) updated" });
    } catch (err){
        console.log(err);
    }
};

module.exports = bulkUpdate;
