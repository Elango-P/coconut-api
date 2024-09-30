const AccountTypeService = require("../../services/AccountTypeService");


async function search(req, res, next) {
    AccountTypeService.search(req, res, next);
}

module.exports = search;
