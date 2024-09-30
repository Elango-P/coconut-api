
const UserLocationService = require("../../services/UserLocationService");

async function search(req, res, next) {
    try {
        UserLocationService.search(req, res, next)
    } catch (err) {
        console.log(err);
    }
};

module.exports = search;