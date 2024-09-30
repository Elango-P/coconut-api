
const verifyToken = require("../../middleware/verifyToken");

const create = require("./create");
const search = require("./search");
const del = require("./delete");
const getDetail = require("./get");
const update = require("./update");
const searchByRole = require("./searchByRole");
const list = require("./list");


module.exports = (server) => {
    server.post("/v1/transferType/create", verifyToken, create);
    server.get("/v1/transferType/search", verifyToken, search);
    server.get("/v1/transferType/list", verifyToken, list);
    server.del("/v1/transferType/:id", verifyToken, del);
    server.get("/v1/transferType/:id", verifyToken, getDetail);
    server.put("/v1/transferType/:id", verifyToken, update);
    server.get("/v1/transferType/searchByRole", verifyToken, searchByRole);

}
