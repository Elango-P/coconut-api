const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");
const get = require("./get")
const add = require("./add");
const update = require('./update');
const del = require('./del');
const statusChange = require('./statusChange');

module.exports = (server) => {
	server.get("/account/vendor/v1/list", verifyToken, list);
	server.post("/account/vendor/v1", verifyToken, add);
	server.get("/account/vendor/v1/:id", verifyToken, get);
	server.put("/account/vendor/v1/:id", verifyToken, update);
	server.put("/account/vendor/v1/status/:id", verifyToken, statusChange);
	server.del("/account/vendor/v1/:id", verifyToken, del);
};
