const ProductPriceService = require("../../services/ProductPriceService");

async function get(req, res, next) {

    await ProductPriceService.get(req, res, next)

};

module.exports = get;
