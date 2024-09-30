const verifyToken = require("../../middleware/verifyToken");
const sendOrderMessage = require("./sendOrderMessage")


module.exports = (server) => {
    server.post("/v1/whatsapp/sendOrderMessage", verifyToken, sendOrderMessage);
};