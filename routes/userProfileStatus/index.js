const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");
const save = require("./save");

module.exports = (server) => {
	server.get("/userProfileStatus/v1", verifyToken, list);
	server.post("/userProfileStatus/v1/:id", verifyToken, save);
};
