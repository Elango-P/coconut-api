const Permission = require("../../helpers/Permission");

// Services
const orderProductService = require("../../services/OrderProductService");

async function cancel(req, res, next) {
    const hasPermission = await Permission.GetValueByName(Permission.ORDER_PRODUCT_CANCEL, req.role_permission);

}

    orderProductService.cancel(req, res);
};

module.exports = cancel;
