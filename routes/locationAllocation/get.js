
const LocationAllocationService = require("../../services/LocationAllocationService");

async function get(req, res, next) {
    await LocationAllocationService.get(req, res, next);
};

module.exports = get;