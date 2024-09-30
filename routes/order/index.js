const verifyToken = require("../../middleware/verifyToken");
const getTotalAmount = require("./getTotalAmount")

module.exports = (server) => {
    server.get("/v1/orderTotal", verifyToken, getTotalAmount);

}