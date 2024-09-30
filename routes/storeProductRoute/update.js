/**
 * Module dependencies
 */
// Status
const { BAD_REQUEST, CREATE_SUCCESS } = require("../../helpers/Response");

// Services
const locationProductService = require("../../services/locationProductService");

/**
 * Store product update route
 */
async function update(req, res, next) {
    try {
        const data = req.body;
       
        const { id } = req.params;


        await locationProductService.updateStoreProductById(id, data);

        res.json(CREATE_SUCCESS, { message: "Location updated", })

    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }
};
module.exports = update;
