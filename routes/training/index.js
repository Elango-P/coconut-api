
const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const get = require("./get");
const search = require("./search");
const update = require("./update");




module.exports = (server) => {
    server.post("/v1/training/create", verifyToken, create);
    server.get("/v1/training/search", verifyToken, search);
    server.get("/v1/training/:id", verifyToken, get);
    server.put("/v1/training/update/:id", verifyToken, update);
    server.del("/v1/training/delete/:id", verifyToken, del);
}
