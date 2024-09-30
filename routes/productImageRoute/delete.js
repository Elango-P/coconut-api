/**
 * Module dependencies
 */
const { BAD_REQUEST, DELETE_SUCCESS } = require("../../helpers/Response");

// Services
const productImageService = require("../../services/ProductImageService");

const productService = require("../../services/ProductService");

/**
 * Product image delete route by product id
 */
 async function del (req, res, next){
    const { imageId } = req.params;
    const companyId = req.user.company_id;

    try {
        const image = await productImageService.getProductImage(imageId);
        const { shopify_product_id } = await productService.getProductDetails(
            image.product_id
        );

        await productImageService.deleteProductImage(imageId);
        // API response
        res.json(DELETE_SUCCESS, { message: "Product image deleted",});
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message,});
    }
};
module.exports = del;
