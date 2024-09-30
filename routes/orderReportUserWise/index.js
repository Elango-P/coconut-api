const verifyToken = require("../../middleware/verifyToken");
const search = require("./search");



module.exports = (server) => {
    server.get("/v1/orderReportUserWise/search", verifyToken, search);

}