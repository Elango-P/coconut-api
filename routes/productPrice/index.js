/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const create = require("./create");
const update = require("./update");
const search = require("./search");
const del = require("./delete");
const updateStatus = require("./updateStatus");
const updateIsDefault = require("./updateIsdefault");
const get = require("./get");

module.exports = (server) => {
    server.post("/v1/productPrice", verifyToken, create);
    server.get("/v1/productPrice/search", verifyToken, search);
    server.put("/v1/productPrice/:id", verifyToken, update);
    server.del("/v1/productPrice/:id", verifyToken, del);
    server.put("/v1/productPrice/updateStatus/:id", verifyToken, updateStatus);
    server.put("/v1/productPrice/updateIsDefault/:id", verifyToken, updateIsDefault);
    server.get("/v1/productPrice/detail/:id", verifyToken, get);
}
