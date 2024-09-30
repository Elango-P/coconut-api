const ReasonService = require("../../services/TransferTypeReasonService");

async function update(req, res, next) {
    ReasonService.update(req, res, next)
};

module.exports = update;
