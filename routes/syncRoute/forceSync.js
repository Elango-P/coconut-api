// Services
const syncService = require("../../services/SyncService");

const { BAD_REQUEST } = require("../../helpers/Response");

const Request = require("../../lib/request");

const History = require("../../services/HistoryService");

const ObjectName = require("../../helpers/ObjectName")

async function forceSync(req, res, next) {
    try {

        let forceSync = req && req.user && req.user.force_sync;

        let userId = Request.getUserId(req);

        if (forceSync) {

            let companyId = Request.GetCompanyId(req);

            let query = req.query;

            let syncData = await syncService.syncToMobile(query, companyId,userId);

            res.json({ forceSync, ...syncData });

            res.on("finish", async () => {
                //create system log for product updation
                History.create("Mobile Background Fetch: Force Sync Started", req,
                    ObjectName.SYSTEM,
                    userId
                );
            })

        } else {
            res.json({ forceSync });

            res.on("finish", async () => {
                //create system log for product updation
                History.create("Mobile Background Fetch: Force Sync Disabled", req,
                    ObjectName.SYSTEM,
                    userId
                );
            })
        }



    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }

};
module.exports = forceSync;
