const verifyToken = require("../../middleware/verifyToken");

const createRoute = require("./create");
const searchRoute = require("./search");
const updateRoute = require("./update");
const get = require("./get");
const deleteRoute = require("./delete");
const updateStatus = require("./updateStatus");
const list = require("./list");
module.exports = (server) => {
    server.post("/v1/sprint", verifyToken, createRoute);
    server.get("/v1/sprint/search", verifyToken, searchRoute);
    server.put("/v1/sprint/:id", verifyToken, updateRoute);
    server.get("/v1/sprint/:id", verifyToken, get);
    server.del("/v1/sprint/:id", verifyToken, deleteRoute);
    server.put("/v1/sprint/status/:id", verifyToken, updateStatus);
    server.get("/v1/sprint/list", verifyToken,list);


};