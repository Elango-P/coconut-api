const Response = require("../../helpers/Response");

const Request = require("../../lib/request")

const LocationService = require("../../services/LocationService");

async function getLocationByIPandGeoLocation(req, res, next) {
    try {

        let locationDetail;

        const { longitude, latitude } = req.query;

        const ipAddress = Request.getIpAddress(req, res)

        const companyId = Request.GetCompanyId(req);

        const roleId = Request.getUserRole(req)

        locationDetail = await LocationService.getLocationInAllowdLocationsByIpAddress(ipAddress, roleId, companyId);

        if (!locationDetail && longitude && latitude) {

            locationDetail = await LocationService.getLoationInAllowdLocationsByGeoLocation(longitude, latitude, roleId, companyId)

            if (!locationDetail) {
                return res.json(Response.OK, { message: "Location Not Found" });
            }
        }

        res.json(Response.OK, { locationDetail: locationDetail })

    } catch (err) {
        console.log(err);
    }

}



module.exports = getLocationByIPandGeoLocation;