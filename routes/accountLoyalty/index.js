const verifyToken = require("../../middleware/verifyToken");
const { create, search, update, get } = require("../../services/accountLoyaltyservice");
const del = require("./delete");

module.exports = (server) => {
    server.post("/v1/accountLoyalty/create", verifyToken, create);
    server.get("/v1/accountLoyalty/search", verifyToken, search);
    server.del("/v1/accountLoyalty/delete/:id", verifyToken, del);
    server.put("/v1/accountLoyalty/update/:id", verifyToken, update);
    server.get("/v1/accountLoyalty/:id", verifyToken, get);


};