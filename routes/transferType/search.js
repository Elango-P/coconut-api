const TransferTypeService = require("../../services/TransferTypeService");


async function search(req, res, next) {
    TransferTypeService.search(req, res, next);
}

module.exports = search;
