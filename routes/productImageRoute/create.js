/**
 * Module dependencies
 */
// Status
const { BAD_REQUEST, CREATE_SUCCESS } = require("../../helpers/Response");

// Services
const productImageService = require("../../services/ProductImageService");

/**
 * Product image create route
 */
 async function create (req, res, next){
    const { id, url } = req.body;

    try {
        await productImageService.addProductImageFromUrl(id, url);

        res.json(CREATE_SUCCESS, { message: "Product image added",});

    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message});
    }
};

module.exports = create;
