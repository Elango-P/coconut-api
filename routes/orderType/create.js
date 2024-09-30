const OrderTypeService = require("../../services/OrderTypeService");

async function create(req, res, next) {
    OrderTypeService.create(req, res, next)
};

module.exports = create;