/**
 * Module dependencies
 */
const async = require("async");

// Status
const {
    BAD_REQUEST,
    CREATE_SUCCESS,
    UNAUTHORIZED,
} = require("../../helpers/Response");

// Services
const locationProductService = require("../../services/locationProductService");

/**
 * Store product bulk delete route
 */
 async function bulkDelete(req, res, next){

    const data = req.body;

    try {
        if (!data.ids) {
            throw { message: "Store product id is required" };
        }

        if (!data.ids.length) {
            throw { message: "Store product ids are required" };
        }

        async.eachSeries(
            data.ids,
            async (id, cb) => {
                try {
                    await locationProductService.deleteStoreProductById(id);
                } catch (err) {
                    return cb();
                }

                cb();
            },
            () =>
            res.json(CREATE_SUCCESS, { message: "Store product(s) deleted",})
        );
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message,})
    }
};

module.exports = bulkDelete;
