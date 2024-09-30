
const TransferTypeService = require("../../services/TransferTypeService");

async function create(req, res, next) {
    TransferTypeService.create(req, res, next);
};

module.exports = create;