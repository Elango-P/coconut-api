const verifyToken = require("../../middleware/verifyToken");
const monthWise = require("./monthWise");

//routes
const search = require("./search");


module.exports = (server) => {
    server.get("/v1/orderSummaryReport/search", verifyToken, search);
    server.get("/v1/orderSummaryReport/monthWise", verifyToken, monthWise);

}