const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");
const create = require("./create");
const getlist = require("./getlist");
const tag = require("./tag");
const tagCreate = require("./tagCreate");
const update = require("./update");
const get = require("./get");
const del = require("./del");

module.exports = (server) => {
	server.get("/jobs/v1/list", verifyToken, list);
	server.post("/jobs/v1", verifyToken, create);
	server.get("/jobs/v1/getlist", verifyToken, getlist);
	server.get("/jobs/v1/tag", verifyToken, tag);
	server.post("/jobs/v1/tag", verifyToken, tagCreate);
	server.put("/jobs/v1/:id", verifyToken, update);
	server.get("/jobs/v1/:id", verifyToken, get);
	server.del("/jobs/v1/:id", verifyToken, del);
};
