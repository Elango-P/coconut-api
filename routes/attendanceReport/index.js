const verifyToken = require("../../middleware/verifyToken");

// Route File
const search = require("./search");

module.exports = (server) => {
	server.get("/v1/attendanceReport", verifyToken, search);
};
