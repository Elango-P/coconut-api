const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const get = require("./get");
const search = require("./search");
const update = require("./update");

module.exports = (server) => {
server.get("/v1/bankSettlement/search", verifyToken, search);
server.post("/v1/bankSettlement/create", verifyToken, create);
server.get("/v1/bankSettlement/:id", verifyToken, get);
server.put("/v1/bankSettlement/update/:id", verifyToken, update);
server.del("/v1/bankSettlement/delete/:id", verifyToken, del);
}