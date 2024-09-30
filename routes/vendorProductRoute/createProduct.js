/**
 * Module dependencies
 */
// Status
const { productIndex } = require("../../db").models;
const Response = require("../../helpers/Response");
const DataBaseService = require("../../lib/dataBaseService");

const productIndexService = new DataBaseService(productIndex);
// Services
const supplierProductService = require("../../services/VendorProductService");

/**
 * Store product create route
 */
async function createProduct(req, res, next) {
    const data = req.body;
    const companyId = req.user && req.user.company_id;

    try {
        if (data.productIds == "") {
            return res.json(Response.BAD_REQUEST, { message: 'Product is Required' });
          }
        let ids = [];
        if (req.body.productIds.includes(",")) {
            ids = req.body.productIds.split(",");
            for (let index = 0; index < ids.length; index++) {
                const id = ids[index];
                const productDetails = await productIndexService.findOne({
                    where: { product_id: id, company_id:companyId },
                });
                const createData = {
                    productId: id,
                    name: productDetails.product_name,
                    sale_price: productDetails.sale_price,
                    company_id: companyId,
                    brand_id: productDetails.brand_id,
                    category_id: productDetails.category_id,
                    vendorId: data.vendorId,
                };
                supplierProductService.createProductVendor(createData);
            }
        }
        else {
            const productDetails = await productIndexService.findOne({
                where: { product_id: data.productIds, company_id:companyId },
            });

            const createData = {
                productId: data.productIds,
                name: productDetails.product_name,
                sale_price: productDetails.sale_price,
                company_id: companyId,
                brand_id: productDetails.brand_id,
                category_id: productDetails.category_id,
                vendorId: data.vendorId,
            };
            supplierProductService.createProductVendor(createData);
        }

        res.json(Response.CREATE_SUCCESS, { message: "Products added" });
    } catch (err) {
        res.json(Response.BAD_REQUEST, { message: err.message });
    }
}
module.exports = createProduct;
