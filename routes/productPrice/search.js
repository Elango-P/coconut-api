const Permission = require("../../helpers/Permission");
const ProductPriceService = require("../../services/ProductPriceService");

/**
 * Product create route
 */
async function search(req, res, next) {
    const hasPermission = await Permission.Has(Permission.PRODUCT_VIEW, req);
    if (!hasPermission) {
        return res.json(400, { message: "Permission Denied" });
    }
    await ProductPriceService.search(req,res,next)

};

module.exports = search;
