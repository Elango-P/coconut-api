const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const list = require("./search");

module.exports = (server) => {
    server.post("/v1/inspection/create", verifyToken, create);
    server.get("/v1/inspection/search", verifyToken, list);
    server.del("/v1/inspection/:id", verifyToken, del);
};