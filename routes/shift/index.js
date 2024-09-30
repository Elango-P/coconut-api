const verifyToken = require("../../middleware/verifyToken");

const createRoute = require("./create");
const searchRoute = require("./search");
const updateRoute = require("./update");
const get = require("./get");
const deleteRoute = require("./delete");
const list = require("./list");
const currentShiftList = require("./currentShiftList");

module.exports = (server) => {
    server.post("/v1/shift", verifyToken, createRoute);
    server.get("/v1/shift/search", verifyToken, searchRoute);
    server.put("/v1/shift/:id", verifyToken, updateRoute);
    server.get("/v1/shift/:id", verifyToken, get);
    server.del("/v1/shift/:id", verifyToken, deleteRoute);
    server.get("/v1/shift/list", verifyToken, list);
    server.get("/v1/shift/currentList", verifyToken, currentShiftList);
};