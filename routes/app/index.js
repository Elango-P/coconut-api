const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const search = require("./search");
const update = require("./update");
const del = require("./delete");
const get = require("./get");


module.exports = (server) => {
	server.post("/v1/app", verifyToken, create);
	server.put("/v1/app", verifyToken, update);
	server.del("/v1/app", verifyToken, del);
	server.get("/v1/app", verifyToken, get);
	server.get("/v1/app/search", verifyToken, search);
};
