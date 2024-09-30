// Status
const { BAD_REQUEST } = require("../../helpers/Response");

// Services
const orderProductService = require("../../services/OrderProductService");

async function getTotalAmount(req, res, next) {
    try {
        let { orderId } = req.query;
        if (orderId && orderId !=="undefined" && orderId !==undefined) {
            await orderProductService.getTotalAmount(req, res, next);
        } else {
            return res.json(200, {
                totalAmount: 0,
            });
        }
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, {
            message: err.message
        });
    }
};
module.exports = getTotalAmount;
