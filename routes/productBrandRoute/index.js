/**
 * Module dependencies
 */
 const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const create = require("./create");
const get = require("./get");
const search = require("./search");
const update = require("./update");
const del = require("./delete");
const updateBrandImage = require("./updateBrandImage");
const getBrandImage = require("./getBrandImage");
const updateStatus = require("./updateStatus");
const brandProductList = require("./brandProductList");
const list = require("./list");

module.exports = (server) => {
    server.get("/v1/product/brand/search",verifyToken,search );
    server.get("/v1/product/brand/list",verifyToken,list );
    server.get("/v1/product/brand/image/:id/:mediaName", getBrandImage);
    server.post("/v1/product/brand", verifyToken, create);
    server.get("/v1/product/brand/:id", verifyToken, get);
    server.put("/v1/product/brand/image/:id", verifyToken, updateBrandImage);
    server.put("/v1/product/brand/:id", verifyToken, update);
    server.del("/v1/product/brand/:id", verifyToken, del);
    server.put("/v1/product/brand/status/:id", verifyToken, updateStatus);
    server.get("/v1/product/brand/productList/search", verifyToken, brandProductList);
}