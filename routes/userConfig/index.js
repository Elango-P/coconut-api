const verifyToken = require("../../middleware/verifyToken");
const save = require("./save");
const list = require("./list");

module.exports = (server) => {
	server.post("/user/config/v1/:id", verifyToken, save);
	server.get("/user/config/v1/:id", verifyToken, list);
};
