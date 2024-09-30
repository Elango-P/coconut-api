const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const search = require("./search");
const update = require("./update");
const del = require("./delete");

module.exports = (server) => {
    server.post("/v1/comment/:id", verifyToken, create);
    server.get("/v1/comment/search", verifyToken, search);
    server.put("/v1/comment/:id", verifyToken, update);
    server.del("/v1/comment/:id/:data", verifyToken, del);

};