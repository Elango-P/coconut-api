/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const create = require("./create");
const update = require("./update");
const search = require("./search");
const del = require("./delete");
const detail = require("./get");
const list = require("./list")

module.exports = (server) => {
    server.post("/v1/address", verifyToken, create);
    server.put("/v1/address/:id", verifyToken, update);
    server.get("/v1/address/search", verifyToken, search);
    server.del("/v1/address/:id", verifyToken, del);
    server.get("/v1/address/:id", verifyToken, detail);
    server.get("/v1/address/list", verifyToken,list);
};
