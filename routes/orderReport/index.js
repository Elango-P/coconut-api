const verifyToken = require("../../middleware/verifyToken");
const getReport = require("./getReport");

module.exports = (server) => {
    server.get("/v1/orderReport", verifyToken, getReport);
}