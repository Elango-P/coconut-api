const Permission = require("../../helpers/Permission");
const ProductPriceService = require("../../services/ProductPriceService");

/**
 * Product create route
 */
async function del(req, res, next) {
    const hasPermission = await Permission.Has(Permission.PRODUCT_EDIT, req);
    if (!hasPermission) {
        return res.json(400, { message: "Permission Denied" });
    }
    await ProductPriceService.del(req,res,next)

};

module.exports = del;
