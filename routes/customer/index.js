const verifyToken = require("../../middleware/verifyToken");
const orderSearch = require("./orderSearch");

module.exports = (server) => {
    server.get("/v1/customer/order/search", verifyToken, orderSearch);
};