const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");
const create = require("./create");
const update = require("./update");
const del = require("./del");
const importList = require("./import");

module.exports = (server) => {
	server.post("/salaryMonthly/v1/import", verifyToken, importList);
	server.get("/salaryMonthly/v1", verifyToken, list);
	server.post("/salaryMonthly/v1", verifyToken, create);
	server.put("/salaryMonthly/v1/:salaryId", verifyToken, update);
	server.del("/salaryMonthly/v1/:salaryId", verifyToken, del);
};
