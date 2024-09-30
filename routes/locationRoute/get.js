/**
 * Module dependencies
 */
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const Request = require("../../lib/request");

// Services
const service = require("../../services/LocationService");

/**
 * Location get route
 */
 async function get(req, res, next){
    const { id } = req.params;
    const companyId = Request.GetCompanyId(req);

    try {
        const locationDetails = await service.getLocationDetails(id,companyId);
        // API response
        res.json(OK, {  data: locationDetails,})
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, {  message: err.message,})
    }
};
module.exports = get;
