// Status
const { BAD_REQUEST } = require("../../helpers/Response");

// Services
const orderProductService = require("../../services/OrderProductService");

async function get(req, res, next) {
    try {
        let { orderId } = req.query;
        if (orderId) {
            await orderProductService.search(req, res, next);
        } else {
            return res.json(200, {
                data: [],
            });
        }
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, {
            message: err.message
        });
    }
};
module.exports = get;
