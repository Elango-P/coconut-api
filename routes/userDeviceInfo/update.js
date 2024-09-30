
const UserDeviceService = require("../../services/UserDeviceInfoService");

async function update(req, res, next) {
    UserDeviceService.update(req, res, next);
};

module.exports = update;