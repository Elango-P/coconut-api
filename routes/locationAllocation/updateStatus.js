const LocationAllocationService = require("../../services/LocationAllocationService");


async function updateStatus(req, res, next) {

  await LocationAllocationService.updateStatus(req, res, next);
}

module.exports = updateStatus;
