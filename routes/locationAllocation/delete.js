
const LocationUserAllocationService = require("../../services/LocationAllocationService");

async function del(req, res, next) {
   await LocationUserAllocationService.del(req, res, next);
};

module.exports = del;