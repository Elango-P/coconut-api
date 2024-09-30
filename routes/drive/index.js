const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");
const getFile = require("./getFile");
const create = require("./create");
const del = require("./del");
const update = require("./update");

module.exports = (server) => {
	server.get("/drive/v1/list", verifyToken, list);
	server.get("/drive/v1/getFile/:fileName", getFile);
	server.post("/drive/v1", verifyToken, create);
	server.del("/drive/v1/:driveId", verifyToken, del);
	server.put("/drive/v1/:driveId", verifyToken, update);
};
