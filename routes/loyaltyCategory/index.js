const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const update = require("./update");
const get = require("./get");
const search = require("./search")

module.exports = (server) => {
    server.post("/v1/loyaltyCategory/create", verifyToken, create);
    server.get("/v1/loyaltyCategory/search", verifyToken, search);
    server.del("/v1/loyaltyCategory/delete/:id", verifyToken, del);
    server.put("/v1/loyaltyCategory/update/:id", verifyToken, update);
    server.get("/v1/loyaltyCategory/:id", verifyToken, get);


};