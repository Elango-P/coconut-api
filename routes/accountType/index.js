
const verifyToken = require("../../middleware/verifyToken");

const create = require("./create");
const search = require("./search");
const del = require("./delete");
const getDetail = require("./get");
const update = require("./update");
const list = require("./list");

module.exports = (server) => {
    server.post("/v1/accountType/create", verifyToken, create);
    server.get("/v1/accountType/search", verifyToken, search);
    server.del("/v1/accountType/:id", verifyToken, del);
    server.get("/v1/accountType/:id", verifyToken, getDetail);
    server.put("/v1/accountType/:id", verifyToken, update);
    server.get("/v1/accountType", verifyToken, list);

}
