const AccountTypeService = require("../../services/AccountTypeService");

async function update(req, res, next) {
    AccountTypeService.update(req, res, next);
};

module.exports = update;
