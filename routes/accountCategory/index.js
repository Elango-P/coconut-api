const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");
const add = require("./add");
const update = require('./update');
const del = require('./del');

module.exports = (server) => {
	server.get("/accountCategory/v1/list", verifyToken, list);
	server.post("/accountCategory/v1/add", verifyToken, add);
	server.put("/accountCategory/v1/:id", verifyToken, update);
	server.del("/accountCategory/v1/:id", verifyToken, del);
};
