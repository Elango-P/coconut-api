
const UserDeviceService = require("../../services/UserDeviceInfoService");

async function create(req, res, next) {
    UserDeviceService.create(req, res, next);
};

module.exports = create;