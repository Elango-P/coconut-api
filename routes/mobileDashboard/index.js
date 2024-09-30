const verifyToken = require("../../middleware/verifyToken");
const { get } = require("./get");

module.exports = (server) => {
	server.get("/v1/mobileDashboard/get", verifyToken, get);
};