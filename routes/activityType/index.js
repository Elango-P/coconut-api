const verifyToken = require("../../middleware/verifyToken");
const search = require("./search");
const create = require("./create");
const get = require("./get");
const del = require("./del");
const update = require("./update");

module.exports = (server) => {
	server.get("/v1/activityType/search", verifyToken, search);
	server.post("/v1/activityType", verifyToken, create);
	server.get("/v1/activityType/:id", verifyToken, get);
	server.del("/v1/activityType/:id", verifyToken, del);
	server.put("/v1/activityType/:id", verifyToken, update);
};
