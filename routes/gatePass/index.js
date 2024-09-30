const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const update = require("./update");
const get = require("./get");
const search = require("./search")

module.exports = (server) => {
    server.post("/v1/gatePass/create", verifyToken, create);
    server.get("/v1/gatePass/search", verifyToken, search);
    server.del("/v1/gatePass/delete/:id", verifyToken, del);
    server.put("/v1/gatePass/update/:id", verifyToken, update);
    server.get("/v1/gatePass/:id", verifyToken, get);


};