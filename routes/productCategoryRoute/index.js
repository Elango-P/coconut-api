/**
 * Module dependencies
 */
 const verifyToken = require("../../middleware/verifyToken");


// Route dependencies
const create = require("./create");
const get = require("./get");
const update = require("./update");
const del = require("./delete");
const search = require("./search");
const updateStatus = require("./updateStatus");
const categoryProductList = require("./categoryProductList");
const list = require("./list");
const productAdd = require("./productAdd");
const bulkUpdate = require("./bulkUpdate")

module.exports = (server) => {
// Product API routes
server.get("/v1/product/category/search", verifyToken, search);
server.get("/v1/product/category/list", verifyToken, list);
server.get("/v1/product/category/:id", verifyToken, get);
server.post("/v1/product/category", verifyToken, create);
server.put("/v1/product/category/:id", verifyToken, update);
server.put("/v1/product/category/bulkUpdate", verifyToken, bulkUpdate);
server.del("/v1/product/category/:id", verifyToken, del);
server.put("/v1/product/category/status/:id", verifyToken, updateStatus);
server.get("/v1/product/category/productList/search", verifyToken, categoryProductList);
server.post("/v1/product/category/productAdd", verifyToken, productAdd);

}