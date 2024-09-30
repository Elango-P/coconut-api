/**
 * Module dependencies
 */
const async = require("async");

// Constants
const { BAD_REQUEST, OK } = require("../../helpers/Response");

// Services
const syncService = require("../../services/SyncService");

async function builkUpdate(req, res, next) {
    const { objectIds, name, status, objectName } = req.body;

    const companyId = req.user.company_id;

    // Validate object ids
    if (!objectIds) {
        return res.json(BAD_REQUEST, { message: "Object ids required", })
    }

    if (!objectIds.length) {
        return res.json(BAD_REQUEST, { message: "Please Select Product", })
    }

    try {
        for (let i = 0; i < objectIds.length; i++) {
            let objectId = objectIds[i];
            const syncDetails = await syncService.isExistByObjectId(
                objectId,
                objectName,
                name,
                companyId
            );

            // Create sync record if sync object not exist
            if (!syncDetails) {
                const createSyncData = {
                    name,
                    objectName,
                    objectId,
                    status,
                };

                await syncService.createSync(createSyncData, companyId);

            }

            // Update the sync object status
            await syncService.updateSyncByObjectId(
                objectId,
                objectName,
                name,
                {
                    status,
                },
                companyId
            );
        }
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }
    res.json(OK, { message: "Sync object(s) updated", })
};

module.exports = builkUpdate;
