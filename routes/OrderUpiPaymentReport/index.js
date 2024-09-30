
const verifyToken = require("../../middleware/verifyToken");
const orderUpiPaymentReport = require("./report");

module.exports = (server) => {
    server.get("/v1/orderUpiPaymentReport", verifyToken, orderUpiPaymentReport);
}
