/**
 * Module dependencies
 */
const { BAD_REQUEST, UPDATE_SUCCESS } = require("../../helpers/Response");

// Services
const syncService = require("../../services/SyncService");

/**
 * Product update route
 */
async function update(req, res, next){
    const data = req.body;
    const { id: objectId } = req.params;

    const { objectName, name } = data;

    const companyId=  req.user.company_id;

    // Update the sync object
    const updateData = {
        status: data.status,
    };

    try {
        await syncService.updateSyncByObjectId(
            objectId,
            objectName,
            name,
            updateData,
            companyId
        ); 
       // API response
        res.json(UPDATE_SUCCESS, { message: "Sync object updated" ,})
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message ,})
    }
};
module.exports = update;
