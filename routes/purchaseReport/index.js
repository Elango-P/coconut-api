const verifyToken = require("../../middleware/verifyToken");
const getReport = require("./grtReport");
//routes
module.exports = (server) => {
    server.get("/v1/purchaseReport", verifyToken, getReport);
}