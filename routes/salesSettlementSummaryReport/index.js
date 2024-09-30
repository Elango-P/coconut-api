const verifyToken = require("../../middleware/verifyToken");

//routes
const search = require("./search");


module.exports = (server) => {
    server.get("/v1/salesSettlementSummaryReport/search", verifyToken, search);

}