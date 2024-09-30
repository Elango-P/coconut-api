/**
 * Module dependencies
 */
const { BAD_REQUEST, UPDATE_SUCCESS } = require("../../helpers/Response");

// Services
const productImageService = require("../../services/ProductImageService");

/**
 * Product image update route
 */
 async function update (req, res, next){
    const data = req.body;

    try {
        // Update image
        await productImageService.updateProductImage(data.imageId, req.body);

        // API response
        res.json(UPDATE_SUCCESS, { message : "Product image updated" });
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message : err.message });
    }
};

module.exports = update;
