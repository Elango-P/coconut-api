const verifyToken = require("../../middleware/verifyToken");
const Report = require("./report");



module.exports = (server) => {
    server.get("/v1/rewardReport", verifyToken, Report);

}