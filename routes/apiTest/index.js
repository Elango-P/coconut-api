const verifyToken = require("../../middleware/verifyToken");

const create = require("./create");
const list = require("./list");

module.exports = (server) => {
	server.post("/apitest/v1", verifyToken, create);
	server.get("/apitest/v1/get/:projectId", verifyToken, list);
};
