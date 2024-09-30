/**
 * Module dependencies
 */
 const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const create = require("./create");
const get = require("./get");
const update = require("./update");
const del = require("./delete");
const search = require("./search");
const updateTagStatus = require("./updateTagStatus");
const list = require("./list");

module.exports = (server) => {
// Tag API routes
server.get("/v1/tagApi/search", verifyToken, search);
server.get("/v1/tagApi/list", verifyToken, list);
server.get("/v1/tagApi/:id", verifyToken, get);
server.post("/v1/tagApi", verifyToken, create);
server.put("/v1/tagApi/:id", verifyToken, update);
server.del("/v1/tagApi/:id", verifyToken, del);
server.put("/v1/tagApi/status/:id", verifyToken, updateTagStatus);
};
