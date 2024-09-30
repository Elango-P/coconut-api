const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const list = require("./list");
const get = require("./get");
const del = require("./delete");
const update = require("./update");


module.exports = (server) => {
	server.post("/user/v1/temperature", verifyToken, create);
	server.get("/user/v1/temperature/list", verifyToken, list);
	server.get("/user/v1/temperature/get/:userId/:mediaName", verifyToken, get);
	server.del("/user/v1/temperature/:userTemperatureId", verifyToken, del);
	server.put("/user/v1/temperature/:userTemperatureId", verifyToken, update);
};
