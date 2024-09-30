const OrderTypeService = require("../../services/OrderTypeService");

async function update(req, res, next) {
    OrderTypeService.update(req, res, next);
};

module.exports = update;
