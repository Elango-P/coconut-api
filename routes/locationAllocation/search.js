
const LocationAllocationService = require("../../services/LocationAllocationService");

async function search(req, res, next) {
    await LocationAllocationService.search(req, res, next);
};

module.exports = search;