// Status
const { BAD_REQUEST, OK } = require("../../helpers/Response");

// Services
const syncService = require("../../services/SyncService");

 async function search (req, res, next){
    const params = req.query;

    try {
        const data = await syncService.searchSync(params);
        res.json(data)
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message : err.message ,})
    }
};
module.exports = search;
