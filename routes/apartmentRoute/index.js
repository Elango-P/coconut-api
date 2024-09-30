/**
 * Module dependencies
 */

// User auth middleware
const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const search = require("./search");
const get = require("./get");
const Delete = require("./delete");
const update = require("./update");
const create = require("./create");


module.exports = (server) => {
    server.get("/v1/apartment/search", verifyToken, search);
	server.get("/v1/apartment/:id", verifyToken, get);
    server.post("/v1/apartment", verifyToken, create);
    server.put("/v1/apartment/:id", verifyToken, update);
    server.post("/v1/apartment/:id", verifyToken, Delete);
}
