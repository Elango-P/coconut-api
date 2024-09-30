/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");

const create = require("./create");
const search = require("./search");
const del = require("./delete");
const update = require("./update");
const productSearch = require("./productList");
const bulkInsert = require("./bulkInsert");
const bulkUpdate = require("./bulkUpdate");
const updateStoreQuantity = require("./updateStoreQuantity");
const updateStatus = require("./updateStatus");
const mobileSearch = require("./mobileSearch");

module.exports = (server) => {
  server.post("/v1/stockProductEntry", verifyToken, create);
  server.get("/v1/stockProductEntry/search", verifyToken, search);
  server.del("/v1/stockProductEntry/:id", verifyToken, del);
  server.put("/v1/stockProductEntry/:id", verifyToken, update);
  server.get("/v1/stockProductEntry/productSearch/:id", verifyToken, productSearch);
  server.post("/v1/stockProductEntry/bulkInsert", verifyToken, bulkInsert);
  server.put("/v1/stockProductEntry/bulkUpdate", verifyToken, bulkUpdate);
  server.put("/v1/stockProductEntry/updateStoreQuantity", verifyToken, updateStoreQuantity);
  server.put("/v1/stockProductEntry/status", verifyToken, updateStatus);
  server.get("/v1/stockProductEntry/mobileSearch", verifyToken, mobileSearch);
};
