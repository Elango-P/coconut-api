/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const create = require("./create");
const update = require("./update");
const updateSortOrder = require("./updateSortOrder");
const search = require("./search");
const del = require("./delete");
const detail = require("./get");
const nextStatus = require("./nextStatus");
const list = require("./list");

module.exports = (server) => {
    // Tag API routes
    server.post("/v1/status", verifyToken, create);
    server.put("/v1/status/:id", verifyToken, update);
    server.put("/v1/status/order", verifyToken, updateSortOrder);
    server.get("/v1/status/search", verifyToken, search);
    server.del("/v1/status/delete/:id", verifyToken, del);
    server.get("/v1/status/:id", verifyToken, detail);
    server.get("/v1/status/nextStatus", verifyToken, nextStatus);
    server.get("/v1/status/list", verifyToken, list);

};
