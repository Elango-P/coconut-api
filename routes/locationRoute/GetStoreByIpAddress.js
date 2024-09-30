const { OK } = require("../../helpers/Response");
const Request = require("../../lib/request")
const History = require("../../services/HistoryService");

const StoreService = require("../../services/LocationService");
const ObjectName = require("../../helpers/ObjectName");


async function get(req, res, next) {
    const ipAddress = Request.getIpAddress(req, res)

    const companyId = Request.GetCompanyId(req);

    const userId = Request.getUserId(req)

    const location = await StoreService.GetStoreByIpAddress(ipAddress, companyId)

    res.json(OK, { id: location?.id, name: location?.name })

    if (location?.id) {
        res.on("finish", async () => {
            //create system log for location select
            History.create(`Location Auto Select: ${location?.name}, auto selected based on IP ${ipAddress}`, req,
                ObjectName.USER, userId
            );
        });
    }

}



module.exports = get;