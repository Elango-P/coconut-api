
const orderService = require("../../services/OrderService");

const Request = require("../../lib/request");

const Response = require("../../helpers/Response");


async function bulkOrder(req, res, next) {
    try {
        const { orderObject, orderProductList } = req.body;

        let companyId = Request.GetCompanyId(req);

        let userId = Request.getUserId(req);

        await orderService.bulkOrder(orderObject, orderProductList, userId, companyId)

        res.json(Response.OK, {
            message: 'Order Created',
        });

    } catch (err) {
        console.log(err);
        res.json(Response.BAD_REQUEST, {
            message: err.message,
        });
    }
};

module.exports = bulkOrder;