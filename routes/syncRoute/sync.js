// Services
const syncService = require("../../services/SyncService");

const { BAD_REQUEST } = require("../../helpers/Response");

const Request = require("../../lib/request");

const History = require("../../services/HistoryService");

const ObjectName = require("../../helpers/ObjectName");
const Number = require("../../lib/Number");
const LocationService = require("../../services/LocationService");

async function sync(req, res, next) {

    try {

        let companyId = Request.GetCompanyId(req);

        let userId = Request.getUserId(req);
        let currentShiftId = Request.getCurrentShiftId(req);
        const currentLocationId = Request.getCurrentLocationId(req);
        let query = req.query;

        if(userId){
            query.user_id = userId
        }

        let syncData = await syncService.syncToMobile(query, companyId,userId);


        if(Number.isNotNull(currentShiftId)){
            syncData.currentShiftId = currentShiftId
        }

        if(Number.isNotNull(currentLocationId)){
            let locationName = await LocationService.getName(currentLocationId,companyId)
            
            syncData.currentLocationId = currentLocationId
            syncData.locationName = locationName
        }

        res.json(syncData);

        res.on("finish", async () => {
            //create system log for product updation
            History.create("Sync Started", req,
                ObjectName.SYSTEM,
                userId
            );
        })

    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }

};
module.exports = sync;
