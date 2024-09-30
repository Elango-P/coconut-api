const TransferTypeService = require("../../services/TransferTypeService");


async function list(req, res, next) {
    TransferTypeService.list(req, res, next);
}

module.exports = list;