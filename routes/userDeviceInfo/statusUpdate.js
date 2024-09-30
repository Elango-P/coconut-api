
const UserDeviceService = require("../../services/UserDeviceInfoService");

async function statusUpdate(req, res, next) {
    UserDeviceService.statusUpdate(req, res, next);
};

module.exports = statusUpdate;