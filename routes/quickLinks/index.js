const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");
const projectQuickLinks = require("./projectQuickLinks");
const create = require("./create");

module.exports = (server) => {
	server.get("/quickLinks/v1", verifyToken, list);
	server.get("/quickLinks/v1/projectList", verifyToken, projectQuickLinks);
	server.post("/quickLinks/v1", verifyToken, create);
};
