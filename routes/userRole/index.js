const verifyToken = require("../../middleware/verifyToken");

// Routes
const createRoute = require("./create");
const searchRoute = require("./search");
const deleteRoute = require("./delete");
const update = require("./update");
const get = require("./get");
const list = require("./list");



module.exports = (server) => {
    server.post("/v1/userRole", verifyToken, createRoute);
    server.get("/v1/userRole/search", verifyToken, searchRoute);
    server.del("/v1/userRole/:id", verifyToken, deleteRoute);
    server.put("/v1/userRole/:id", verifyToken, update);
    server.get("/v1/userRole/:id", verifyToken, get);
    server.get("/v1/userRole/list", verifyToken, list);
}