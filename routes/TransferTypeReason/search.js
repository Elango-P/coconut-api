const ReasonService = require("../../services/TransferTypeReasonService");

async function search(req, res, next) {
    ReasonService.search(req, res, next)
}

module.exports = search;
