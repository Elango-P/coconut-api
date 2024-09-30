/**
 * Module dependencies
 */
const { BAD_REQUEST, OK } = require("../../helpers/Response");

// Services
const supplierProductService = require("../../services/VendorProductService");

/**
 * Product get route by product id
 */
 async function get (req, res, next) {
    const { id } = req.params;

    const companyId =req.user.company_id;

    try {
        const data = await supplierProductService.getVendorProductById(id, companyId);
        res.json(data);
    } catch (err) {
        res.json(BAD_REQUEST, {message : err.message});
    }
};
module.exports = get;
