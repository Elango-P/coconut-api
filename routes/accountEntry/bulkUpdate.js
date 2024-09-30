
// Status
const AccountEntryService = require("../../services/AccountEntryService");

async function bulkUpdate(req, res, next) {
    await AccountEntryService.bulkUpdate(req, res, next)
};
module.exports = bulkUpdate;