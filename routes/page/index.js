const verifyToken = require("../../middleware/verifyToken");

// Route File
const list = require("./list");
const create = require("./create");
const update = require("./update");
const del = require("./del");
const get = require("./get");

module.exports = (server) => {
	server.get("/v1/docs/list", verifyToken, list);
	server.post("/v1/docs", verifyToken, create);
	server.put("/v1/docs/:id", verifyToken, update);
	server.del("/v1/docs/:id", verifyToken, del);
	server.get("/v1/docs/:id", verifyToken, get);
};
