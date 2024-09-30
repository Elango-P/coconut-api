/**
 * Module dependencies
 */
 const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const search = require("./search");
const create = require("./create");
const update =  require("./update");
const bulkUpdate = require("./bulkUpdate");
const del = require("./delete");

module.exports = (server) => {
    // Product image API routes
server.get("/v1/product/image/search", verifyToken, search);

server.post("/v1/product/image/create", verifyToken, create);

server.put("/v1/product/image/update/:productId", verifyToken, update);

server.post("/v1/product/image/delete/:imageId", verifyToken, del);

server.put("/v1/product/image/bulk/update", verifyToken, bulkUpdate);

}
