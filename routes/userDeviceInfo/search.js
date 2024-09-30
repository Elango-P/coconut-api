
const UserDeviceService = require("../../services/UserDeviceInfoService");

async function search(req, res, next) {
    UserDeviceService.search(req, res, next);
};

module.exports = search;