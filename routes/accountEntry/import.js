const { BAD_REQUEST, OK } = require("../../helpers/Response");

//systemLog
const { AccountEntry } = require("../../db").models;
const AccountEntryService = require("../../services/AccountEntryService");
const Permission = require("../../helpers/Permission");

/**
 * acountentry create route
 */
async function importAccountEntry(req, res, next) {
    const hasPermission = await Permission.Has(Permission.ACCOUNT_ENTRY_ADD, req);

    if (!hasPermission) {
      return res.json(400, { message: "Permission Denied" });
    }
    AccountEntryService.importAccountEntry(req, res, next)
}
module.exports = importAccountEntry;
