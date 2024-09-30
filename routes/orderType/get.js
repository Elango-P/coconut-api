const OrderTypeService = require("../../services/OrderTypeService");

async function Get(req, res, next) {
    OrderTypeService.get(req, res, next);
}

module.exports = Get;
