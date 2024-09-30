const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const list = require("./list");
const update = require("./update");
const del = require("./delete");
const get = require("./get");

module.exports = (server) => {
	server.post("/userDocument/v1", verifyToken, create);
	server.get("/userDocument/v1/list/:userId", verifyToken, list);
	server.get("/userDocument/v1/:userId/:mediaName", get);
	server.put("/userDocument/v1/:userDocumentId", verifyToken, update);
	server.del("/userDocument/v1/:userDocumentId", verifyToken, del);
};
