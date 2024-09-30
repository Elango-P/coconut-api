/**
 * Module dependencies
 */
const async = require("async");

// Status
const { BAD_REQUEST, CREATE_SUCCESS } = require("../../helpers/Response");

// Services
const locationProductService = require("../../services/locationProductService");

/**
 * Store product bulk create route
 */
async function bulkCreate(req, res, next){
    const data = req.body;

    try {
        if (!data.productIds) {
            throw { message: "Product id is required" };
        }

        if (!data.storeId) {
            throw { message: "Location id is required" };
        }

        if (!data.productIds.length) {
            throw { message: "Product ids are required" };
        }

        async.eachSeries(
            data.productIds,
            async (productId, cb) => {
                const createData = {
                    productId,
                    storeId: data.storeId,
                };

                try {
                    await locationProductService.createStoreProduct(createData);
                } catch (err) {
                    return cb();
                }

                cb();
            },
            () =>
            res.json(CREATE_SUCCESS, { message : "Location(s) added",})
        );
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message : err.message,})
    }
};

module.exports = bulkCreate;
