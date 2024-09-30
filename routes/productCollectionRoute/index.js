/**
 * Module dependencies
 */
 const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const search = require("./search");
const create  =require("./create");
const get = require("./get");
const update = require("./update");
const del = require("./del");

module.exports = (server) => {
    server.get("/v1/product/collection/search", verifyToken, search);
    server.post("/v1/product/collection", verifyToken, create);
    server.get("/v1/product/collection/:id", verifyToken, get);
    server.put("/v1/product/collection/:id", verifyToken, update);
    server.post("/v1/product/collection/:id", verifyToken, del);
}
