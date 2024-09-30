 
const ReasonService = require("../../services/TransferTypeReasonService");

async function create(req, res, next) {
  await ReasonService.create(req, res, next);
};

module.exports = create;