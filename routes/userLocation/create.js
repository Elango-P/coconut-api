
const UserLocationService = require("../../services/UserLocationService");

async function create(req, res, next) {
    UserLocationService.create(req, res, next);
};

module.exports = create;