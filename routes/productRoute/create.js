const Permission = require("../../helpers/Permission");
const productService = require("../../services/ProductService");

/**
 * Product create route
 */
async function create(req, res, next) {
    const hasPermission = await Permission.Has(Permission.PRODUCT_ADD, req);
    if (!hasPermission) {
        return res.json(400, { message: "Permission Denied" });
    }
    await productService.create(req,res,next)

};

module.exports = create;
