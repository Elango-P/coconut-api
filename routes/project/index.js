const verifyToken = require("../../middleware/verifyToken");

const createRoute = require("./create");
const searchRoute = require("./search");
const updateRoute = require("./update");
const list = require("./list");
const get = require("./get");
const deleteRoute = require("./delete");
const updateStatus = require("./updateStatus");

module.exports = (server) => {
    server.post("/v1/project", verifyToken, createRoute);
    server.get("/v1/project/search", verifyToken, searchRoute);
    server.get("/v1/project/list", verifyToken, list);
    server.put("/v1/project/:id", verifyToken, updateRoute);
    server.get("/v1/project/:id", verifyToken, get);
    server.del("/v1/project/:id", verifyToken, deleteRoute);
    server.put("/v1/project/status/:id", verifyToken, updateStatus);

};