const verifyToken = require("../../middleware/verifyToken");

const create = require("./create");
const list = require("./list");

module.exports = (server) => {
	server.post("/user/permission/v1", verifyToken, create);
	server.get("/user/permission/v1/list", verifyToken, list);
};
