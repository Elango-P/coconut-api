const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");

module.exports = (server) => {
	server.get("/category/v1", verifyToken, list);
};
