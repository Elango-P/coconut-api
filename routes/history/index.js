const verifyToken = require("../../middleware/verifyToken");

const list = require("./list");
const create = require("./create");

module.exports = (server) => {
	server.get("/v1/history", verifyToken, list);
	server.post("/v1/history/create", verifyToken,create);
};
