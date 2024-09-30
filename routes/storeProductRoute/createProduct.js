/**
 * Module dependencies
 */
// Status
const { BAD_REQUEST, CREATE_SUCCESS } = require("../../helpers/Response");

// Services
const locationProductService = require("../../services/locationProductService");

/**
 * Store product create route
 */
async function create(req, res, next) {
    const data = req.body;
    const companyId = req.user && req.user.company_id;

    if (data.productIds == '') {
        return res.json(BAD_REQUEST, { message: "Product Required" })
    }
    
    try {
        let ids = [];
        if (req.body.productIds.includes(",")) {
            ids = req.body.productIds.split(",");
            ids.forEach((id) => {
                const createData = {
                    productId: id,
                    storeId: data.storeId,
                    storeProductId: data.storeProductId,
                    company_id: companyId,
                };
                locationProductService.createStoreProduct(createData);
            });
        }
        else {
            const createData = {
                productId: req.body.productIds,
                storeId: data.storeId,
                storeProductId: data.storeProductId,
                company_id: companyId,
            };
            locationProductService.createStoreProduct(createData);
        }

        res.json(CREATE_SUCCESS, { message: "Products added" });
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message });
    }
}
module.exports = create;
