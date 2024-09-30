const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const list = require("./list");
const search = require("./search");
const update = require("./update");

module.exports = (server) => {
    server.post("/v1/locationRack", verifyToken, create);
    server.get("/v1/locationRack/search", verifyToken, search);
    server.put("/v1/locationRack", verifyToken, update);
    server.del("/v1/locationRack", verifyToken, del);
    server.get("/v1/locationRack/list", verifyToken, list);
};