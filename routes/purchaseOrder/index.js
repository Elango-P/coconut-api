const verifyToken = require("../../middleware/verifyToken");

const createRoute = require("./create");
const get = require("./get")
const list = require("./search")
const update = require("./update")
const updateByStatus = require("./updateByStatus")
const productList = require("./vendorProductList")
const del = require("./delete");
const clone = require("./clone");
const createRecommendedProducts= require("./createRecommendedProducts");

module.exports = (server) => {
    server.post("/v1/purchaseOrder", verifyToken, createRoute);
    server.get("/v1/purchaseOrder/:id", verifyToken, get);
    server.get("/v1/purchaseOrder/search", verifyToken, list);
    server.put("/v1/purchaseOrder/:id", verifyToken, update);
    server.put("/v1/purchaseOrder/status/:id", verifyToken, updateByStatus);
    server.get("/v1/purchaseOrder/productList", verifyToken, productList);
    server.del("/v1/purchaseOrder/:id", verifyToken, del);

    server.put("/v1/purchaseOrder/clone/:id", verifyToken, clone);
    server.post("/v1/purchaseOrder/createRecommendedProducts", verifyToken, createRecommendedProducts);
};