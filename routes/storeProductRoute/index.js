/**
 * Module dependencies
 */
 const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const search = require ("./search");
const create = require("./create");
const bulkCreate = require("./bulkCreate");
const update = require("./update");
const del  = require("./delete");
const get = require("./get");
const bulkExportToStore = require("./bulkExportToStore");
const exportToStoreJob = require("./exportToStoreJob");
const exportToStore = require("./exportToStore");
const bulkDelete = require("./bulkDelete");
const createProduct = require("./createProduct");
const bulkUpdate =require("./bulkUpdate")
const searchByReplenish = require("./searchByReplenish");
const updateMinMaxQuantity = require("./updateMinMaxQuantity");
const updateOrderQuantity = require("./updateOrderQuantity");
const updateTransferQuantity = require("./updateTransferQuantity");
const reIndex = require("./reIndex");
const addToStoreProduct = require("./addToStoreProduct");

module.exports = (server) => {
    server.get("/v1/storeProduct/search", verifyToken, search);
    server.get("/v1/storeProduct/:id", verifyToken, get);
    
    server.post("/v1/storeProduct", verifyToken, create);
    server.post("/v1/storeProduct/bulk/create", verifyToken, bulkCreate);
    server.post("/v1/storeProduct/bulk/export", verifyToken, bulkExportToStore);
    server.post("/v1/storeProduct/export/job", exportToStoreJob);
    server.post("/v1/storeProduct/export", verifyToken, exportToStore);
    
    server.put("/v1/storeProduct/:id", verifyToken, update);
    
    server.patch("/v1/storeProduct/bulk/delete", verifyToken, bulkDelete);
    server.put("/v1/storeProduct/bulkUpdate", verifyToken, bulkUpdate);
    server.del("/v1/storeProduct/:storeProductId", verifyToken, del);
    server.post("/v1/storeProduct/productAdd", verifyToken, createProduct);
    server.get("/v1/storeProduct/replenish/search", verifyToken, searchByReplenish);
    server.put("/v1/storeProduct/updateMinMaxQuantity/:id", verifyToken, updateMinMaxQuantity);
    server.put("/v1/storeProduct/updateOrderQuantity/:product_id", verifyToken, updateOrderQuantity);
    server.put("/v1/storeProduct/updateTransferQuantity/:product_id", verifyToken, updateTransferQuantity);
    server.put("/v1/storeProduct/reIndex/:product_id", verifyToken, reIndex);
    server.put("/v1/storeProduct/addToStockEntry/:product_id", verifyToken, addToStoreProduct);

}
