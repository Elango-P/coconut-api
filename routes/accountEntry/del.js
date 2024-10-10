const { AccountEntry } = require("../../db").models;
const AccountEntryService = require("../../services/AccountEntryService");
const Permission = require("../../helpers/Permission");

async function deleteAccountEntry(req, res, next) {
 
  AccountEntryService.del(req, res, next)
}

module.exports = deleteAccountEntry;
