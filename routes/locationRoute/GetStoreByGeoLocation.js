const { OK, BAD_REQUEST } = require("../../helpers/Response");
const Request = require("../../lib/request")
const History = require("../../services/HistoryService");

const StoreService = require("../../services/LocationService");
const ObjectName = require("../../helpers/ObjectName");
const Number = require("../../lib/Number")


async function get(req, res, next) {
  try {

    const { latitude, longitude } = req.query;

    if (!latitude) {
      return res.json(OK, { message: "Latitude is Required" });
    }

    if (!longitude) {
      return res.json(OK, { message: "Longitude is Required" });
    }

    const companyId = Request.GetCompanyId(req);

    const userId = Request.getUserId(req);

    const locations = await StoreService.GetStoreByLocation(ObjectName.LOCATION, companyId);

    const reqLatitude = Number.truncateDecimal(latitude, 3);

    const reqLongitude = Number.truncateDecimal(longitude, 3);
    
    let matchingLocation = locations && locations.length > 0 && locations.find((location) => Number.truncateDecimal(location.latitude, 3) == reqLatitude && Number.truncateDecimal(location.longitude, 3) == reqLongitude);

    if (matchingLocation) {

      res.json(OK, { id: matchingLocation.object_id, name: matchingLocation.name });

      res.on("finish", async () => {
        History.create(`Location Auto Select: ${matchingLocation.name}, auto selected based on Location`, req, ObjectName.USER, userId);
      });

    } else {
      return res.json(OK, { message: "Location Not Matched" })
    }

  } catch (error) {
    console.error(error);
    res.json(BAD_REQUEST, { message: err.message });
  }


}






module.exports = get;