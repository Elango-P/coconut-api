const verifyToken = require("../../middleware/verifyToken");

const create = require("./create");
const search = require("./search")
const update = require("./update")
const updateByStatus = require("./updateByStatus")
const del = require("./delete")


module.exports = (server) => {
    server.post("/v1/purchaseOrderProduct", verifyToken, create);
    server.get("/v1/purchaseOrderProduct/search", verifyToken, search);
    server.put("/v1/purchaseOrderProduct/:id", verifyToken, update);
    server.put("/v1/purchaseOrderProduct/status/:id", verifyToken, updateByStatus);
    server.del("/v1/purchaseOrderProduct/:id", verifyToken, del);

};