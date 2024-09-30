/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");

const create = require("./create");
const search = require("./search");
const del = require("./delete");
const updateStatus = require("./updateStatus");

module.exports = (server) => {
    server.post("/v1/saleProduct", verifyToken, create);
    server.get("/v1/saleProduct/search", verifyToken, search);
    server.del("/v1/saleProduct/:id", verifyToken, del);
    server.put("/v1/saleProduct/status/:id", verifyToken, updateStatus);
}
