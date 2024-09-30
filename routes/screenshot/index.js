const verifyToken = require("../../middleware/verifyToken");
const isAdmin = require("../../middleware/isAdmin");
const create = require("./create");
const get = require("./get");
const list = require("./list");
const bulkDelete = require("./bulkDelete");

module.exports = (server) => {
	server.post("/screenshot/v1", verifyToken, create);
	server.get("/screenshot/v1/list", verifyToken, isAdmin, list);
	server.get("/screenshot/v1/:mediaName", get);
	server.del("/screenshot/v1/bulkDelete", verifyToken, isAdmin, bulkDelete);
};
