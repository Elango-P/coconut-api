const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const search=require("./search")
const del = require("./delete");
const update = require("./update");
const get = require("./get");

module.exports = (server) => {
    server.post("/v1/visitor", verifyToken, create);
    server.get("/v1/visitor/search", verifyToken, search);
    server.del("/v1/visitor/delete/:id", verifyToken, del);
    server.put("/v1/visitor/:id", verifyToken, update);
    server.get("/v1/visitor/:id", verifyToken, get);


};