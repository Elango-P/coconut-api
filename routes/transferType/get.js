const TransferTypeService = require("../../services/TransferTypeService");

async function Get(req, res, next) {
    TransferTypeService.get(req, res, next);
}

module.exports = Get;
