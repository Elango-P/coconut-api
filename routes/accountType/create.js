
const AccountTypeService = require("../../services/AccountTypeService");

async function create(req, res, next) {
    AccountTypeService.create(req, res, next);
};

module.exports = create;