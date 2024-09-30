const verifyToken = require("../../middleware/verifyToken");
const search = require("./list");
const create = require("./create");
const update = require("./update");
const del = require("./del");
const get = require("./get");

module.exports = (server) => {
	server.get("/holidays/v1/search", verifyToken, search);
	server.post("/holidays/v1", verifyToken, create);
	server.put("/holidays/v1/:id", verifyToken, update);
	server.del("/holidays/v1/:id", verifyToken, del);
	server.get("/holidays/v1/:id", verifyToken, get);
};
