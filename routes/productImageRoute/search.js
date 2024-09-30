// Status
const { BAD_REQUEST, OK } = require("../../helpers/Response");

// Services
const productImageService = require("../../services/ProductImageService");

 async function search (req, res, next){
    const params = req.query;

    try {
        const data = await productImageService.searchProductImage(params);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message : err.message });
    }
};

module.exports = search;
