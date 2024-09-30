const AccountTypeService = require("../../services/AccountTypeService");

async function Get(req, res, next) {
    AccountTypeService.get(req, res, next);
}

module.exports = Get;
