const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const get = require("./get");
const search = require("./search");
const update = require("./update");
const list = require("./list");


module.exports = (server) => {
	server.post("/v1/attendanceType/create", verifyToken, create);
	server.get("/v1/attendanceType/search", verifyToken, search);
	server.del("/v1/attendanceType/delete/:id", verifyToken, del);
	server.put("/v1/attendanceType/update/:id", verifyToken, update);
	server.get("/v1/attendanceType/:id", verifyToken, get);
	server.get("/v1/attendanceType", verifyToken, list);
};
