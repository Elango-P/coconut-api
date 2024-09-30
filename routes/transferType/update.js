const TransferTypeService = require("../../services/TransferTypeService");

async function update(req, res, next) {
    TransferTypeService.update(req, res, next);
};

module.exports = update;
