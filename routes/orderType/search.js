const OrderTypeService = require("../../services/OrderTypeService");


async function search(req, res, next) {
    OrderTypeService.search(req, res, next);
}

module.exports = search;
