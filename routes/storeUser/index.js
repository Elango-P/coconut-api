/**
 * Module dependencies
 */
 const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const create = require("./create");
const get = require("./get");
const del = require("./delete");
const search = require("./search");


module.exports = (server) => {
// Tag API routes
server.get("/v1/storeUser/search", verifyToken, search);
server.get("/v1/storeUser/:id/:id", verifyToken, get);

server.post("/v1/storeUser/:id", verifyToken, create);
server.del("/v1/storeUser/:id", verifyToken, del);
};
