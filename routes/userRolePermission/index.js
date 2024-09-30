const verifyToken = require("../../middleware/verifyToken");

const createRoute = require("./create");
const serarchRoute = require("./search");
const deleteRoute = require("./delete");
const list = require("./list")

module.exports = (server) => {
    server.post("/v1/user/role/permission", verifyToken, createRoute);
    server.get("/v1/user/role/permission/search", verifyToken, serarchRoute);
    server.get("/v1/user/role/permission/list", verifyToken, list);
    server.del("/v1/user/role/permission/:id", verifyToken, deleteRoute);
}