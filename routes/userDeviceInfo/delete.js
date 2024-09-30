
const UserDeviceService = require("../../services/UserDeviceInfoService");

async function bulkDelete(req, res, next) {
    UserDeviceService.bulkDelete(req, res, next);
};

module.exports = bulkDelete;