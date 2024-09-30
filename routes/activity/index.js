const verifyToken = require("../../middleware/verifyToken");
const search = require("./search");
const create = require("./create");
const get = require("./get");
const del = require("./del");
const update = require("./update");
const bulkDelete = require("./bulkDelete");
const updateStatus = require("./updateStatus");
const bulkUpdate = require("./bulkUpdate");

module.exports = (server) => {
	server.get("/activity/v1/search", verifyToken, search);
	server.post("/activity/v1", verifyToken, create);
	server.get("/activity/v1/:id", verifyToken, get);
	server.del("/activity/v1/:id", verifyToken, del);
	server.put("/activity/v1/:id", verifyToken, update);
	server.post("/activity/v1/bulkDelete", verifyToken, bulkDelete);
	server.put("/activity/v1/bulkUpdate", verifyToken, bulkUpdate);
	server.put("/activity/v1/updateStatus/:id", verifyToken, updateStatus);

};
