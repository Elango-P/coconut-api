
const verifyToken = require("../../middleware/verifyToken");

const create = require("./create");
const search = require("./search");
const del = require("./delete");
const getDetail = require("./get");
const update = require("./update");
const list = require("./list");

module.exports = (server) => {
    server.post("/v1/orderType/create", verifyToken, create);
    server.get("/v1/orderType/search", verifyToken, search);
    server.del("/v1/orderType/:id", verifyToken, del);
    server.get("/v1/orderType/:id", verifyToken, getDetail);
    server.put("/v1/orderType/:id", verifyToken, update);
    server.get("/v1/orderType", verifyToken, list);

}
