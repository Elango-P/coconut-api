/**
 * Module dependencies
 */
 const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const get = require("./get");
const syncVendorProduct= require("./syncVendorProduct");
const search = require("./search");
const create = require("./create");
const update = require("./update");
const del = require("./delete");
const bulkUpdate = require("./bulkUpdate");
const bulkDelete= require("./bulkDelete");
const syncProduct = require("./syncProduct");
const updateStatus = require("./updateStatus");
const sync = require("./sync");
const importProduct = require("./importProduct");
const clone = require("./clone");
const updatePrice = require("./updatePrice");
const reindex = require("./reindex");
const priceSearch = require("./priceSearch");
const list = require("./list");
const merge = require("./merge");

module.exports = (server) => {
// Product API routes
server.get("/v1/product/search", verifyToken, search);
server.get("/v1/product/list",  list);
server.get("/v1/product/:id", verifyToken, get);
server.get("/v1/product/sync", verifyToken, sync);

server.post("/v1/product", verifyToken, create);
server.post("/v1/product/import", verifyToken, importProduct);

server.put("/v1/product/bulk/update", verifyToken, bulkUpdate);
server.put("/v1/product/bulk/delete", verifyToken, bulkDelete);
server.put("/v1/product/sync/:id", verifyToken, syncProduct);
server.put("/v1/product/:id", verifyToken, update);
server.put("/v1/product/updatePrice/:id", verifyToken, updatePrice);
server.put("/v1/product/status/:id", verifyToken, updateStatus);

server.del("/v1/product/:id", verifyToken, del);
server.put("/v1/product/syncVendorProduct/:id", verifyToken, syncVendorProduct);
server.put("/v1/product/clone/:id", verifyToken, clone);
server.put("/v1/product/reindex", verifyToken, reindex);

server.get("/v1/product/price/search", verifyToken, priceSearch);
server.put("/v1/product/merge/:id", verifyToken, merge);



}
