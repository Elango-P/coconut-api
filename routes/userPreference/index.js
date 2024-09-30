const verifyToken = require("../../middleware/verifyToken");
const save = require("./save");
const list = require("./list");
const getPreference = require("./getPreference");

module.exports = (server) => {
	server.post("/userPreference/v1/", verifyToken, save);
	server.get("/userPreference/v1/", verifyToken, list);
	server.get("/userPreference/v1/:key", verifyToken, getPreference);
};
