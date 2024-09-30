const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");
const add = require("./add");
const update = require("./update");
const get = require("./get");
const del = require("./del");
const statusUpdate = require("./statusUpdate");
const importAccountEntry = require("./import");
const bulkUpdate = require("./bulkUpdate");

module.exports = (server) => {
	server.get("/accountEntry/v1/list", verifyToken, list);
	server.post("/accountEntry/v1", verifyToken, add);
	server.put("/accountEntry/v1/:id", verifyToken, update);
	server.get("/accountEntry/v1/:id", verifyToken, get);
	server.del("/accountEntry/v1/:id", verifyToken, del);
	server.put("/accountEntry/v1/status/:id", verifyToken, statusUpdate);
	server.post("/accountEntry/v1/import", verifyToken, importAccountEntry);
	server.put("/accountEntry/v1/bulkUpdate/:ids", verifyToken, bulkUpdate);


};
