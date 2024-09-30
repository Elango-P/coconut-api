const verifyToken = require("../../middleware/verifyToken");

const search = require("./search");

module.exports = (server) => {
	server.get("/v1/fineReport/search", verifyToken, search);
};
