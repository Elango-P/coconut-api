const TransferTypeService = require("../../services/TransferTypeService");


async function searchByRole(req, res, next) {
    TransferTypeService.searchByRole(req, res, next);
}

module.exports = searchByRole;
