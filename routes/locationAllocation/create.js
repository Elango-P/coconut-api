
const LocationAllocationService = require("../../services/LocationAllocationService");

async function create(req, res, next) {
    await LocationAllocationService.create(req, res, next);
};

module.exports = create;