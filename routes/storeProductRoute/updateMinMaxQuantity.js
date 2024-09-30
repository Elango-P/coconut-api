/**
 * Module dependencies
 */
// Status
const { BAD_REQUEST, CREATE_SUCCESS } = require("../../helpers/Response");

// Services
const StoreProductMinMaxQuantityUpdateService = require("../../services/StoreProductMinMaxQuantityUpdateService");

const Request = require('../../lib/request');

/**
 * Store product update route
 */
async function updateMinMaxQuantity(req, res, next) {
    try {
        let productId = req && req.params && req.params.id;

        const companyId = Request.GetCompanyId(req);

        if (!productId) {
            return res.json(BAD_REQUEST, { message: "Product Id is Required", })
        }

        res.json(CREATE_SUCCESS, { message: "Location Product Min Max Quantity updated", })

        res.on("finish", async () => {

            await StoreProductMinMaxQuantityUpdateService.update(companyId, productId);

        });

    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }
};
module.exports = updateMinMaxQuantity;
