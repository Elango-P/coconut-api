/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const create = require("./create");
const update = require("./update");
const search = require("./search");
const del = require("./delete");
const get = require("./get");

module.exports = (server) => {
    // Tag API routes
    server.post("/v1/tagType", verifyToken, create);
    server.put("/v1/tagType/:id", verifyToken, update);
    server.get("/v1/tagType/search", verifyToken, search);
    server.del("/v1/tagType/:id", verifyToken, del);
    server.get("/v1/tagType/:id", verifyToken, get);

};
