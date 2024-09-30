const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");

module.exports = (server) => {
	server.get("/userDocument/type/v1/list", verifyToken, list);
};
